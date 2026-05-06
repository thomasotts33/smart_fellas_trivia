import { CategoryBarChart } from "@/components/charts/CategoryBarChart";

export type CategoryAnalyticsItem = {
  name: string;
  correct: number;
  total: number;
  percentCorrect: number;
  pointsEarned: number;
  pointsPossible: number;
};

export function CategoryPerformance({ categories }: { categories: CategoryAnalyticsItem[] }) {
  const topCategories = categories.slice(0, 6);

  return (
    <section style={{ border: "1px solid var(--sf-border)", borderRadius: "8px", padding: "16px" }}>
      <h2 style={{ fontFamily: "Oswald, Inter, sans-serif", fontSize: "20px", margin: "0 0 12px" }}>
        Category performance
      </h2>
      {topCategories.length === 0 ? <p style={{ color: "var(--sf-muted)", margin: 0 }}>No categories yet.</p> : null}
      {topCategories.length > 0 ? <CategoryBarChart data={topCategories} /> : null}
      <div style={{ display: "grid", gap: "10px", marginTop: "12px" }}>
        {topCategories.map((category) => (
          <div key={category.name}>
            <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
              <strong>{category.name}</strong>
              <span>
                {category.correct}/{category.total} · {category.percentCorrect}%
              </span>
            </div>
            <p style={{ color: "var(--sf-muted)", fontSize: "13px", margin: "4px 0 0" }}>
              {category.pointsEarned}/{category.pointsPossible} points
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
