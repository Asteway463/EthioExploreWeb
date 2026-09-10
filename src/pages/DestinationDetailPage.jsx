import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, Heart, MapPin, MapPinned, Plus, TriangleAlert, Send, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { RatingStars } from "../components/DestinationCard";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { DESTINATIONS, findDestination } from "../lib/data";
import { formatEtb, formatUsd, useTrip } from "../lib/trip-store";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import api from "../lib/api";

export function DestinationDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const staticDestination = findDestination(id);

  const [destination, setDestination] = useState(staticDestination || null);
  const [comments, setComments] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const { isAuthenticated, user } = useAuth();
  const { isFavorite, toggleFavorite, addStop } = useTrip();

  const loadDestinationDetail = async () => {
    if (!id) return;

    try {
      setIsLoading(true);

      const response = await api.get(`/api/destinations/${id}`);
      if (response && response.success && response.destination) {
        setDestination(response.destination);
        setComments(Array.isArray(response.destination.comments) ? response.destination.comments : []);
        setPhotos(Array.isArray(response.destination.photos) ? response.destination.photos : []);
        return;
      }

      if (staticDestination) {
        setDestination(staticDestination);
        setComments([]);
        setPhotos([]);
      }
    } catch (error) {
      console.warn("Could not load live destination details:", error.message);
      if (staticDestination) {
        setDestination(staticDestination);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDestinationDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const displayDestination = destination || staticDestination;

  const handleMapOpen = () => {
    if (!displayDestination) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    window.open(displayDestination.mapUrl || displayDestination.googleMapUrl, "_blank", "noopener,noreferrer");
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!commentText.trim()) {
      toast.error("Please write a comment before posting.");
      return;
    }

    try {
      setIsPostingComment(true);
      await api.post(`/api/destinations/${id}/comments`, { text: commentText.trim() });
      setCommentText("");
      await loadDestinationDetail();
      toast.success("Comment posted successfully.");
    } catch (error) {
      toast.error(error.message || "Comment could not be posted.");
    } finally {
      setIsPostingComment(false);
    }
  };

  const handlePhotoSubmit = async (event) => {
    event.preventDefault();

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!photoUrl.trim()) {
      toast.error("Add a photo URL to upload.");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      await api.post(`/api/destinations/${id}/photos`, {
        imageUrl: photoUrl.trim(),
        caption: photoCaption.trim(),
      });
      setPhotoUrl("");
      setPhotoCaption("");
      await loadDestinationDetail();
      toast.success("Photo uploaded successfully.");
    } catch (error) {
      toast.error(error.message || "Photo upload failed.");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  if (!displayDestination) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h1 className="text-2xl font-bold text-ink">Destination Not Found</h1>
          <p className="mt-2 text-muted-foreground">The destination you are looking for does not exist.</p>
          <Link
            to="/destinations"
            className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Back to all destinations
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const ratingValue = Number(displayDestination.rating ?? 4.8);
  const related = DESTINATIONS.filter((x) => x.region === displayDestination.region && x.id !== displayDestination.id).slice(0, 3);
  const galleryImages = Array.isArray(displayDestination.gallery) && displayDestination.gallery.length
    ? displayDestination.gallery
    : Array.isArray(photos) && photos.length
      ? photos.map((photo) => photo.image_url || photo.imageUrl)
      : [displayDestination.imageUrl].filter(Boolean);
  const fav = isFavorite(displayDestination.id);
  const destinationComments = comments.length ? comments : displayDestination.comments || [];
  const destinationPhotos = photos.length ? photos : displayDestination.photos || [];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <section className="relative flex h-72 items-end overflow-hidden md:h-96">
        <img src={displayDestination.imageUrl || displayDestination.image_url} alt={displayDestination.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-8 md:px-8">
          <Link
            to="/destinations"
            className="mb-4 inline-flex items-center gap-1 text-xs font-semibold text-ink-foreground/90 transition hover:text-ink-foreground"
          >
            <ArrowLeft className="size-4" /> All destinations
          </Link>
          <span className="block text-xs font-bold tracking-widest text-ink-foreground/80 uppercase">
            {displayDestination.tag || displayDestination.category}
          </span>
          <h1 className="font-display text-3xl font-extrabold text-ink-foreground md:text-5xl">
            {displayDestination.name}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-sm text-ink-foreground/85">
            <MapPin className="size-4" /> {displayDestination.region} · {displayDestination.category}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl flex-1 gap-8 px-5 py-10 md:px-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <RatingStars rating={ratingValue} />
              <span className="text-sm font-semibold text-ink">{ratingValue.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">· Difficulty: {displayDestination.level}</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">{displayDestination.description || displayDestination.desc || displayDestination.shortDesc}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Best season", displayDestination.bestSeason || "Year-round"],
              ["Suggested stay", displayDestination.durationDays || "2–3 Days"],
              ["Coordinates", `${Number(displayDestination.lat || 0).toFixed(2)}, ${Number(displayDestination.lng || 0).toFixed(2)}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <p className="text-xs text-muted-foreground">{k}</p>
                <p className="font-display font-bold text-ink mt-1">{v}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 font-display font-bold text-ink">
              <TriangleAlert className="size-4 text-gold" /> Travel tips
            </h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Carry cash in birr — card acceptance outside Addis Ababa is limited.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Local guides are mandatory in several parks and greatly improve the visit.
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">•</span> Altitude and heat vary hugely by region; pack layers for the highlands.
              </li>
            </ul>
          </div>

          {galleryImages.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-ink">
                <ImagePlus className="size-5 text-primary" /> Photo gallery
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {galleryImages.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${displayDestination.name} gallery ${index + 1}`}
                    className="h-44 w-full rounded-xl object-cover border border-border"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Traveler comments</h2>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="mb-5 space-y-3">
                <textarea
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  placeholder="Share your experience at this destination..."
                  className="min-h-[90px] w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isPostingComment}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
                  >
                    <Send className="size-4" />
                    {isPostingComment ? "Posting..." : "Post comment"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-5 rounded-xl border border-dashed border-border bg-background p-3 text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { from: location } })}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  Log in
                </button>
                <span> to post comments and photos.</span>
              </div>
            )}

            <div className="space-y-3">
              {destinationComments.length ? (
                destinationComments.map((comment) => (
                  <div key={comment.id || `${comment.user_name}-${comment.created_at}`} className="rounded-xl border border-border bg-background p-3">
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-ink">{comment.user_name || comment.userName || "Explorer"}</p>
                      <span className="text-[11px] text-muted-foreground">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "Just now"}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">{comment.text || comment.comment || "No comment text"}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your experience.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Upload a traveler photo</h2>

            {isAuthenticated ? (
              <form onSubmit={handlePhotoSubmit} className="space-y-3">
                <input
                  type="url"
                  value={photoUrl}
                  onChange={(event) => setPhotoUrl(event.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                />
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(event) => setPhotoCaption(event.target.value)}
                  placeholder="Optional caption for your photo"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-0 placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={isUploadingPhoto}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-70"
                >
                  <ImagePlus className="size-4" />
                  {isUploadingPhoto ? "Uploading..." : "Upload photo"}
                </button>
              </form>
            ) : (
              <p className="text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={() => navigate("/login", { state: { from: location } })}
                  className="font-semibold text-primary underline underline-offset-2"
                >
                  Log in
                </button>
                <span> to upload a destination photo.</span>
              </p>
            )}

            {destinationPhotos.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {destinationPhotos.map((photo) => (
                  <div key={photo.id || `${photo.image_url}-${photo.created_at}`} className="overflow-hidden rounded-xl border border-border bg-background">
                    <img src={photo.image_url || photo.imageUrl} alt={photo.caption || "Destination photo"} className="h-40 w-full object-cover" />
                    {photo.caption && <p className="p-2 text-xs text-muted-foreground">{photo.caption}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {related.length > 0 && (
            <div>
              <h2 className="mb-4 font-display text-lg font-bold text-ink">
                More in {displayDestination.region}
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/destinations/${r.id}`}
                    className="card-lift rounded-2xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="font-display font-bold text-ink">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="font-display text-2xl font-extrabold text-primary">
              {formatUsd(Number(displayDestination.price || displayDestination.price_usd || 0))}
              <span className="text-sm font-normal text-muted-foreground"> / person</span>
            </p>
            <p className="text-xs text-muted-foreground">{formatEtb(Number(displayDestination.price || displayDestination.price_usd || 0))}</p>
            <button
              type="button"
              onClick={handleMapOpen}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              <MapPinned className="size-4" /> View on Google Maps
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: location } });
                  return;
                }

                addStop(displayDestination.id);
                toast.success(`${displayDestination.name} added to your itinerary`);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.99]"
            >
              <Plus className="size-4" /> Add to trip planner
            </button>
            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/login", { state: { from: location } });
                  return;
                }

                toggleFavorite(displayDestination.id);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background py-3 text-sm font-semibold text-ink transition hover:bg-mist"
            >
              <Heart
                className={cn("size-4", fav ? "fill-destructive text-destructive" : "text-muted-foreground")}
              />
              {fav ? "Saved to favorites" : "Save to favorites"}
            </button>
          </div>
        </aside>
      </div>
      <Footer />
    </div>
  );
}

export default DestinationDetailPage;
