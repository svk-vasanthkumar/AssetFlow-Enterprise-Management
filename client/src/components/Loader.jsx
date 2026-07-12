export function Loader() {
  return (
    <div className="loader-container">
      <div className="loader-spinner" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <div className="skeleton-grid">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="skeleton-grid skeleton-grid-3">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
      <div className="skeleton-grid skeleton-grid-2">
        <div className="skeleton-card skeleton-card-lg" />
        <div className="skeleton-card skeleton-card-lg" />
      </div>
    </div>
  );
}
