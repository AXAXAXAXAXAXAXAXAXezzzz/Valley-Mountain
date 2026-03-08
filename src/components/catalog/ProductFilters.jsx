export default function ProductFilters({ filters, setFilters, categories }) {
  const controlClass =
    "h-11 rounded-full border border-zinc-300 bg-white px-4 text-sm dark:border-zinc-700 dark:bg-zinc-900";

  return (
    <div className="flex flex-wrap gap-3">
      <input
        className={`${controlClass} min-w-[130px] flex-1 md:min-w-[180px]`}
        placeholder="Search"
        value={filters.search}
        onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
      />

      <select
        className={`${controlClass} min-w-[130px]`}
        value={filters.category}
        onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
      >
        <option value="all">Category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select
        className={`${controlClass} min-w-[110px]`}
        value={filters.size}
        onChange={(event) => setFilters((prev) => ({ ...prev, size: event.target.value }))}
      >
        <option value="all">Size</option>
        {["XS", "S", "M", "L", "XL"].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <select
        className={`${controlClass} min-w-[120px]`}
        value={filters.color}
        onChange={(event) => setFilters((prev) => ({ ...prev, color: event.target.value }))}
      >
        <option value="all">Color</option>
        {["Black", "White", "Gray", "Navy", "Olive", "Sand"].map((color) => (
          <option key={color} value={color}>
            {color}
          </option>
        ))}
      </select>

      <select
        className={`${controlClass} min-w-[170px]`}
        value={filters.sort}
        onChange={(event) => setFilters((prev) => ({ ...prev, sort: event.target.value }))}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price Low to High</option>
        <option value="price-desc">Price High to Low</option>
        <option value="popular">Popularity</option>
      </select>

      <input
        type="number"
        min="1"
        className={`${controlClass} w-24`}
        value={filters.minPrice}
        onChange={(event) => setFilters((prev) => ({ ...prev, minPrice: event.target.value }))}
        placeholder="Min price"
      />

      <input
        type="number"
        min="1"
        className={`${controlClass} w-24`}
        value={filters.maxPrice}
        onChange={(event) => setFilters((prev) => ({ ...prev, maxPrice: event.target.value }))}
        placeholder="Max price"
      />

      <label className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-zinc-300 px-4 text-sm dark:border-zinc-700">
        <input
          type="checkbox"
          checked={filters.onlyNew}
          onChange={(event) => setFilters((prev) => ({ ...prev, onlyNew: event.target.checked }))}
        />
        New only
      </label>

      <label className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-zinc-300 px-4 text-sm dark:border-zinc-700">
        <input
          type="checkbox"
          checked={filters.inStock}
          onChange={(event) => setFilters((prev) => ({ ...prev, inStock: event.target.checked }))}
        />
        In stock
      </label>

      <label className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-zinc-300 px-4 text-sm dark:border-zinc-700">
        <input
          type="checkbox"
          checked={filters.featured}
          onChange={(event) => setFilters((prev) => ({ ...prev, featured: event.target.checked }))}
        />
        Featured
      </label>
    </div>
  );
}
