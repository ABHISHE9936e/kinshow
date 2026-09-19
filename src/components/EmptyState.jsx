export const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {/* Optional Call to Action (CTA) button if passed as a prop */}
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
};