import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi, categoriesApi } from "@/services/api";
import { useT } from "@/hooks/useT";
import { getCountriesList } from "@/utils/helpers";
import type { Job, Category, Country, JobType } from "@/types";

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mobileFilter, setMobileFilter] = useState(false);
  const { t } = useT();
  const j = t('jobs');

  const search = searchParams.get("search") || "";
  const country = searchParams.get("country") || "";
  const jobType = searchParams.get("jobType") || "";
  const categoryId = searchParams.get("categoryId") || "";

  useEffect(() => {
    categoriesApi.getAll().then((r) => setCats(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    jobsApi
      .getAll({ search, country, jobType, categoryId, limit: 20 })
      .then((r) => {
        setJobs(r.data.data);
        setTotal(r.data.meta.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, country, jobType, categoryId]);

  const COUNTRIES: { value: Country | ""; label: string }[] = [
    { value: "", label: j.allCountries },
    ...getCountriesList() as { value: Country; label: string }[],
  ];

  const jt = t('jobType');
  const JOB_TYPES: { value: JobType | ""; label: string }[] = [
    { value: "", label: j.allTypes },
    { value: "full_time", label: jt.full_time },
    { value: "part_time", label: jt.part_time },
    { value: "contract",  label: jt.contract },
    { value: "seasonal",  label: jt.seasonal },
  ];

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val);
    else p.delete(key);
    setSearchParams(p);
  };
  const clearAll = () => setSearchParams({});
  const hasFilters = !!(search || country || jobType || categoryId);

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <label className="text-xs text-brand-muted uppercase tracking-widest font-semibold mb-2 block">
          {j.country}
        </label>
        <div className="space-y-1">
          {COUNTRIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setParam("country", c.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                country === c.value
                  ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-brand-muted uppercase tracking-widest font-semibold mb-2 block">
          {j.jobType}
        </label>
        <div className="space-y-1">
          {JOB_TYPES.map((tp) => (
            <button
              key={tp.value}
              onClick={() => setParam("jobType", tp.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                jobType === tp.value
                  ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-brand-muted uppercase tracking-widest font-semibold mb-2 block">
          {j.industry}
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setParam("categoryId", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !categoryId
                ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
                : "text-gray-300 hover:bg-white/5"
            }`}
          >
            {j.allCategories}
          </button>
          {cats.map((c) => (
            <button
              key={c.id}
              onClick={() => setParam("categoryId", c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                categoryId === c.id
                  ? "bg-brand-yellow/15 text-brand-yellow border border-brand-yellow/30"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span>{c.icon}</span>
              <span className="flex-1">{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 text-sm hover:bg-red-500/10 transition-colors flex items-center justify-center gap-1.5"
        >
          <X size={14} /> {j.clearFilters}
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pt-20">
      <div className="bg-brand-card border-b border-brand-border py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="section-title mb-1">
            <span className="gradient-text">{j.title}</span>
          </h1>
          <p className="text-brand-muted text-sm">{j.subtitle}</p>
          <div className="mt-6 flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                value={search}
                onChange={(e) => setParam("search", e.target.value)}
                placeholder={j.search}
                className="input-dark pl-11 h-12 text-sm"
              />
            </div>
            <button
              onClick={() => setMobileFilter(true)}
              className="md:hidden btn-outline h-12 px-4 flex items-center gap-2 text-sm"
            >
              <Filter size={15} /> {j.filters}
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-brand-yellow" />}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="hidden md:block w-60 shrink-0">
            <div className="card-dark p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <span className="font-semibold text-white text-sm flex items-center gap-2">
                  <Filter size={14} /> {j.filters}
                </span>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-300">
                    {j.clearAll}
                  </button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-brand-muted">
                {j.found} <span className="text-white font-semibold">{total}</span> {j.positions}
              </span>
              <div className="flex items-center gap-2 text-xs text-brand-muted">
                <span>{j.sort}</span>
                <button className="flex items-center gap-1 text-white hover:text-brand-yellow transition-colors">
                  {j.newest} <ChevronDown size={12} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 bg-brand-card rounded-2xl animate-pulse border border-brand-border" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="card-dark p-16 text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-white font-semibold mb-1">{j.noResults}</p>
                <p className="text-brand-muted text-sm">{j.noResultsSub}</p>
                <button onClick={clearAll} className="mt-4 btn-outline text-sm px-5 py-2">
                  {j.clearFilters}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFilter && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFilter(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-brand-card border-l border-brand-border p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <span className="font-semibold text-white">{j.filters}</span>
              <button onClick={() => setMobileFilter(false)}>
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}
    </div>
  );
}
