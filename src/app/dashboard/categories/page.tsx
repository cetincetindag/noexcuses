import { CategoryCard } from "~/components/categories/category-card"
import { defaultCategories } from "~/lib/utils"

export default function CategoriesPage() {
  return (
    <div className="flex flex-col gap-6 pl-0 lg:pl-56">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">Manage your task and goal categories</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {defaultCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  )
}

