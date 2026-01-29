# صفحة البحث

## المثال الكامل

```nunjucks
<div class="search-page max-w-6xl mx-auto px-4 py-8" x-data="searchPage()">
  <h1 class="text-2xl font-bold mb-6">{{t("search.title")}}</h1>

  {# نموذج البحث #}
  <div class="bg-white rounded-lg shadow-md p-4 mb-6">
    <form @submit.prevent="search()" class="flex gap-2">
      <input
        type="text"
        x-model="query"
        placeholder="{{t('search.placeholder')}}"
        class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
      <button
        type="submit"
        class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90">
        {{t("header.search")}}
      </button>
    </form>

    {# الفلاتر #}
    <div class="flex flex-wrap gap-4 mt-4">
      {# الترتيب #}
      <select
        x-model="filters.sort"
        @change="search()"
        class="px-4 py-2 border rounded-lg">
        <option value="">{{t("search.sort_by")}}</option>
        <option value="price-asc">{{t("search.price_low_high")}}</option>
        <option value="price-desc">{{t("search.price_high_low")}}</option>
        <option value="created-desc">{{t("search.newest")}}</option>
        <option value="rating-desc">{{t("search.highest_rated")}}</option>
      </select>

      {# نطاق السعر #}
      <div class="flex items-center gap-2">
        <input
          type="number"
          x-model="filters.minPrice"
          placeholder="{{t('search.min_price')}}"
          class="w-24 px-3 py-2 border rounded-lg">
        <span>-</span>
        <input
          type="number"
          x-model="filters.maxPrice"
          placeholder="{{t('search.max_price')}}"
          class="w-24 px-3 py-2 border rounded-lg">
        <button
          @click="search()"
          class="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
          {{t("search.apply")}}
        </button>
      </div>
    </div>
  </div>

  {# النتائج #}
  <template x-if="loading">
    <div class="text-center py-12">
      <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
      <p class="mt-4 text-gray-500">{{t("search.loading")}}</p>
    </div>
  </template>

  <template x-if="!loading && results.length > 0">
    <div>
      <p class="text-gray-500 mb-4">
        {{t("search.results_for")}} "<span x-text="query"></span>"
        (<span x-text="results.length"></span> {{t("search.results")}})
      </p>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <template x-for="product in results" :key="product._id">
          <div class="product-card bg-white rounded-lg shadow-md overflow-hidden">
            <a :href="'/product/' + product.slug">
              <img :src="product.images[0]?.fileUrl"
                   :alt="product.title"
                   class="w-full h-48 object-cover">
            </a>
            <div class="p-4">
              <h3 class="font-medium mb-2 line-clamp-2" x-text="product.title"></h3>
              <p class="text-primary font-bold" x-text="formatMoney(product.pricing.price)"></p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </template>

  <template x-if="!loading && results.length === 0 && searched">
    <div class="bg-white rounded-lg shadow-md p-12 text-center">
      <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <h2 class="text-xl font-bold text-gray-600 mb-2">{{t("search.no_results")}}</h2>
      <p class="text-gray-400">{{t("search.try_different")}}</p>
    </div>
  </template>
</div>

<script>
  function searchPage() {
    return {
      query: new URLSearchParams(window.location.search).get('q') || '',
      filters: {
        sort: '',
        minPrice: '',
        maxPrice: ''
      },
      results: [],
      loading: false,
      searched: false,

      async init() {
        if (this.query) {
          await this.search();
        }
      },

      async search() {
        if (!this.query.trim()) return;

        this.loading = true;
        this.searched = true;

        const params = { q: this.query };
        if (this.filters.sort) params.sort = this.filters.sort;
        if (this.filters.minPrice) params.minPrice = this.filters.minPrice;
        if (this.filters.maxPrice) params.maxPrice = this.filters.maxPrice;

        const data = await SearchManager.search(this.query, params);
        this.results = data.products || [];
        this.loading = false;

        // تحديث URL
        const url = new URL(window.location);
        url.searchParams.set('q', this.query);
        window.history.pushState({}, '', url);
      },

      formatMoney(amount) {
        return Qumra.utils.formatMoney(amount);
      }
    };
  }
</script>
```
