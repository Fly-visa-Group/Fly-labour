import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Eye,
  CheckCircle,
  Building2,
  Globe,
} from "lucide-react";
import {
  COUNTRY_LABELS,
  JOBTYPE_LABELS,
  formatSalary,
  formatDate,
} from "@/utils/helpers";
import { useAuthStore } from "@/store/authStore";
import { jobsApi, applicationsApi } from "@/services/api";
import type { Job } from "@/types";
import toast from "react-hot-toast";

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();

  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dateOfBirth: "",
    address: user?.address || "",
    education: "",
    experience: "",
    languageLevel: "",
    coverLetter: "",
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    jobsApi
      .getOne(id)
      .then((r) => {
        setJob(r.data);
        // Lấy việc làm liên quan cùng quốc gia
        jobsApi
          .getAll({ country: r.data.country, limit: 3 })
          .then((res) =>
            setRelatedJobs(res.data.data.filter((j: Job) => j.id !== id)),
          )
          .catch(() => {});
      })
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Tự điền thông tin user nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  if (loading)
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!job)
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-white font-semibold mb-2">
            Không tìm thấy bài đăng
          </p>
          <Link to="/jobs" className="btn-primary text-sm px-5 py-2">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để ứng tuyển");
      navigate("/login");
      return;
    }
    setShowForm(true);
    setTimeout(
      () =>
        document
          .getElementById("apply-form")
          ?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }
    setSubmitting(true);
    try {
      await applicationsApi.create({ ...form, jobId: job.id });
      setSubmitted(true);
      toast.success("Ứng tuyển thành công! Chúng tôi sẽ liên hệ sớm.");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Ứng tuyển thất bại, thử lại sau",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Breadcrumb */}
      <div className="border-b border-brand-border bg-brand-card/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm text-brand-muted">
          <Link to="/" className="hover:text-white transition-colors">
            Trang chủ
          </Link>
          <span>/</span>
          <Link to="/jobs" className="hover:text-white transition-colors">
            Việc làm
          </Link>
          <span>/</span>
          <span className="text-white truncate max-w-xs">{job.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 text-sm text-brand-muted hover:text-white transition-colors"
            >
              <ArrowLeft size={15} /> Quay lại danh sách
            </Link>

            {/* Job header card */}
            <div className="card-dark overflow-hidden">
              <div className="relative h-52 md:h-64 bg-brand-dark overflow-hidden">
                <img
                  src={
                    job.image ||
                    (job.country === "australia"
                      ? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&fit=crop"
                      : job.country === "canada"
                        ? "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1200&q=80&fit=crop"
                        : "https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80&fit=crop")
                  }
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/40 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                  <span className="badge-country backdrop-blur-sm bg-black/40">
                    {job.country === "australia"
                      ? "🇦🇺"
                      : job.country === "canada"
                        ? "🇨🇦"
                        : "🇳🇿"}{" "}
                    {COUNTRY_LABELS[job.country]
                      .replace(/🇦🇺|🇨🇦|🇳🇿/g, "")
                      .trim()}
                  </span>
                  <span className="bg-black/40 backdrop-blur-sm text-gray-200 text-xs px-2.5 py-0.5 rounded-full border border-white/20">
                    {JOBTYPE_LABELS[job.jobType]}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {job.isHot && (
                    <span className="badge-hot backdrop-blur-sm">🔥 Hot</span>
                  )}
                  {job.isFeatured && (
                    <span className="bg-brand-yellow/90 text-black text-xs font-bold px-2 py-0.5 rounded-full">
                      ⭐ Nổi bật
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="flex gap-2 flex-wrap mb-4">
                  {job.isHot && <span className="badge-hot">🔥 Hot</span>}
                  {job.isFeatured && (
                    <span className="bg-brand-yellow/20 text-brand-yellow text-xs font-bold px-2 py-0.5 rounded-full uppercase">
                      ⭐ Nổi bật
                    </span>
                  )}
                  <span className="badge-country">
                    {job.country === "australia"
                      ? "🇦🇺"
                      : job.country === "canada"
                        ? "🇨🇦"
                        : "🇳🇿"}{" "}
                    {COUNTRY_LABELS[job.country]
                      .replace(/🇦🇺|🇨🇦|🇳🇿/g, "")
                      .trim()}
                  </span>
                  <span className="bg-white/5 text-gray-400 text-xs px-2 py-0.5 rounded border border-white/10">
                    {JOBTYPE_LABELS[job.jobType]}
                  </span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {job.title}
                </h1>
                {job.company && (
                  <div className="flex items-center gap-1.5 text-brand-muted text-sm mb-5">
                    <Building2 size={14} /> {job.company}
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-brand-yellow/5 border border-brand-yellow/20 rounded-xl p-3 text-center">
                    <TrendingUp
                      size={16}
                      className="text-brand-yellow mx-auto mb-1"
                    />
                    <p className="text-brand-yellow font-semibold text-sm">
                      {formatSalary(
                        job.salaryMin,
                        job.salaryMax,
                        job.salaryCurrency,
                      )}
                    </p>
                    <p className="text-brand-muted text-xs">Thu nhập</p>
                  </div>
                  {job.location && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <MapPin
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {job.location}
                      </p>
                      <p className="text-brand-muted text-xs">Địa điểm</p>
                    </div>
                  )}
                  {job.slots && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Users
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {job.slots} người
                      </p>
                      <p className="text-brand-muted text-xs">Chỉ tiêu</p>
                    </div>
                  )}
                  {job.deadline && (
                    <div className="bg-white/5 rounded-xl p-3 text-center">
                      <Calendar
                        size={16}
                        className="text-brand-muted mx-auto mb-1"
                      />
                      <p className="text-white text-sm font-medium">
                        {formatDate(job.deadline)}
                      </p>
                      <p className="text-brand-muted text-xs">Hạn nộp</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card-dark p-6">
              <h2 className="font-semibold text-white text-lg mb-4 flex items-center gap-2">
                <Globe size={18} className="text-brand-yellow" /> Mô tả công
                việc
              </h2>
              <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {job.requirements && (
              <div className="card-dark p-6">
                <h2 className="font-semibold text-white text-lg mb-4">
                  📋 Yêu cầu
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm whitespace-pre-line">
                  {job.requirements}
                </p>
              </div>
            )}

            {job.benefits && (
              <div className="card-dark p-6">
                <h2 className="font-semibold text-white text-lg mb-4">
                  🎁 Quyền lợi
                </h2>
                <div className="space-y-2">
                  {job.benefits
                    .split(".")
                    .filter(Boolean)
                    .map((b, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle
                          size={15}
                          className="text-green-400 mt-0.5 shrink-0"
                        />
                        {b.trim()}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Apply form */}
            {showForm && !submitted && (
              <div className="card-dark p-6" id="apply-form">
                <h2 className="font-semibold text-white text-lg mb-6">
                  📝 Điền thông tin ứng tuyển
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Họ tên đầy đủ *
                      </label>
                      <input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        className="input-dark"
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Số điện thoại *
                      </label>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        className="input-dark"
                        placeholder="0901 234 567"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="input-dark"
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          setForm({ ...form, dateOfBirth: e.target.value })
                        }
                        className="input-dark"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Địa chỉ
                      </label>
                      <input
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        className="input-dark"
                        placeholder="Quận/Huyện, Tỉnh/TP"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Trình độ học vấn
                      </label>
                      <select
                        value={form.education}
                        onChange={(e) =>
                          setForm({ ...form, education: e.target.value })
                        }
                        className="input-dark"
                      >
                        <option value="">-- Chọn --</option>
                        <option>THPT</option>
                        <option>Trung cấp</option>
                        <option>Cao đẳng</option>
                        <option>Đại học</option>
                        <option>Sau đại học</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Tiếng Anh
                      </label>
                      <select
                        value={form.languageLevel}
                        onChange={(e) =>
                          setForm({ ...form, languageLevel: e.target.value })
                        }
                        className="input-dark"
                      >
                        <option value="">-- Chọn --</option>
                        <option>Cơ bản</option>
                        <option>Giao tiếp được</option>
                        <option>IELTS 5.0-5.5</option>
                        <option>IELTS 6.0+</option>
                        <option>Bản ngữ</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Kinh nghiệm
                      </label>
                      <textarea
                        value={form.experience}
                        onChange={(e) =>
                          setForm({ ...form, experience: e.target.value })
                        }
                        className="input-dark h-24 resize-none"
                        placeholder="Mô tả kinh nghiệm làm việc của bạn..."
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs text-brand-muted mb-1.5 block">
                        Thư xin việc
                      </label>
                      <textarea
                        value={form.coverLetter}
                        onChange={(e) =>
                          setForm({ ...form, coverLetter: e.target.value })
                        }
                        className="input-dark h-28 resize-none"
                        placeholder="Giới thiệu bản thân và lý do muốn ứng tuyển..."
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex-1 py-3 flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />{" "}
                          Đang gửi...
                        </>
                      ) : (
                        "✉️ Nộp hồ sơ ứng tuyển"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="btn-outline px-6"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}

            {submitted && (
              <div className="card-dark p-8 text-center border-green-500/30">
                <CheckCircle
                  size={48}
                  className="text-green-400 mx-auto mb-3"
                />
                <h3 className="text-white font-semibold text-lg mb-2">
                  Ứng tuyển thành công!
                </h3>
                <p className="text-brand-muted text-sm">
                  Chúng tôi đã nhận được hồ sơ của bạn và sẽ liên hệ trong vòng
                  24-48 giờ.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="card-dark p-5 sticky top-24">
              <div className="text-center mb-5">
                <p className="text-brand-yellow font-semibold text-xl mb-0.5">
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency,
                  )}
                </p>
                <p className="text-brand-muted text-xs">Thu nhập ước tính</p>
              </div>
              {!submitted ? (
                <button
                  onClick={handleApply}
                  className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
                >
                  🚀 Ứng tuyển ngay
                </button>
              ) : (
                <div className="w-full py-3.5 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center text-sm font-medium">
                  ✅ Đã ứng tuyển
                </div>
              )}
              <p className="text-center text-xs text-brand-muted mt-3">
                Miễn phí · Không ràng buộc
              </p>
              <div className="mt-4 pt-4 border-t border-brand-border space-y-2 text-xs text-brand-muted">
                <div className="flex justify-between">
                  <span>Đăng ngày</span>
                  <span className="text-white">
                    {formatDate(job.createdAt)}
                  </span>
                </div>
                {job.deadline && (
                  <div className="flex justify-between">
                    <span>Hạn nộp</span>
                    <span className="text-brand-orange">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Lượt xem</span>
                  <span className="text-white flex items-center gap-1">
                    <Eye size={11} />
                    {job.viewCount}
                  </span>
                </div>
              </div>
            </div>

            {relatedJobs.length > 0 && (
              <div className="card-dark p-5">
                <h3 className="font-semibold text-white text-sm mb-4">
                  Việc làm tương tự
                </h3>
                <div className="space-y-3">
                  {relatedJobs.map((j) => (
                    <Link
                      key={j.id}
                      to={`/jobs/${j.id}`}
                      className="block p-3 bg-brand-dark rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <p className="text-sm text-white group-hover:text-brand-yellow transition-colors line-clamp-1">
                        {j.title}
                      </p>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {j.company}
                      </p>
                      <p className="text-xs text-brand-yellow mt-1">
                        {formatSalary(
                          j.salaryMin,
                          j.salaryMax,
                          j.salaryCurrency,
                        )}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
