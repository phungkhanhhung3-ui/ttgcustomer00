
import React, { useEffect, useMemo, useState } from "react";
import {
  Star,
  Package,
  Truck,
  ShieldCheck,
  Smile,
  BarChart3,
  MessageSquare,
  Search,
  Flame,
  AlertTriangle,
  QrCode,
  ClipboardList,
} from "lucide-react";

const metrics = [
  { key: "deliveryTime", label: "Thời gian giao hàng", Icon: Truck },
  { key: "staffAttitude", label: "Thái độ nhân viên", Icon: Smile },
  { key: "cargoSafety", label: "Mức độ an toàn hàng hóa", Icon: ShieldCheck },
  { key: "overall", label: "Mức độ hài lòng chung", Icon: Star },
];

const statusOptions = ["Đang lấy hàng", "Đang vận chuyển", "Đã giao", "Giao thất bại"];

const demoOrders = [
  { orderCode: "TTG001245", customerName: "Nguyễn Minh Anh", status: "Đã giao" },
  { orderCode: "TTG001246", customerName: "Công ty An Phát", status: "Đã giao" },
  { orderCode: "TTG001247", customerName: "Lê Hải Nam", status: "Đã giao" },
  { orderCode: "TTG001248", customerName: "Công ty Minh Long", status: "Đang vận chuyển" },
  { orderCode: "TTG001249", customerName: "Trần Hoài Phương", status: "Đang lấy hàng" },
];

const initialReviews = [
  {
    orderCode: "TTG001245",
    customerName: "Nguyễn Minh Anh",
    status: "Đã giao",
    deliveryTime: 5,
    staffAttitude: 4,
    cargoSafety: 5,
    overall: 5,
    issueType: "Không có",
    note: "Giao đúng hẹn, nhân viên hỗ trợ tốt.",
  },
  {
    orderCode: "TTG001246",
    customerName: "Công ty An Phát",
    status: "Đã giao",
    deliveryTime: 4,
    staffAttitude: 5,
    cargoSafety: 4,
    overall: 4,
    issueType: "Cập nhật trạng thái",
    note: "Hàng hóa an toàn, nên cập nhật trạng thái thường xuyên hơn.",
  },
  {
    orderCode: "TTG001247",
    customerName: "Lê Hải Nam",
    status: "Đã giao",
    deliveryTime: 3,
    staffAttitude: 4,
    cargoSafety: 4,
    overall: 4,
    issueType: "Giao hàng chậm",
    note: "Nhìn chung ổn, nhưng giao hơi muộn.",
  },
];

function TTGLogo() {
  return (
    <div className="ttg-logo">
      <div className="ttg-logo-icon">
        <Flame size={28} />
      </div>
      <div>
        <div className="ttg-logo-text">TTG</div>
        <div className="ttg-logo-sub">Logistics Service</div>
      </div>
    </div>
  );
}

function Badge({ children, tone = "red" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function StarRating({ value, onChange }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" className="star-button" onClick={() => onChange(star)}>
          <Star size={22} className={star <= value ? "star active" : "star"} />
        </button>
      ))}
      <span className="subtle">{value}/5</span>
    </div>
  );
}

function StatCard({ title, value, subtitle, Icon }) {
  return (
    <div className="card stat-card">
      <div>
        <div className="subtle">{title}</div>
        <div className="stat-value">{value}</div>
        <div className="subtle small">{subtitle}</div>
      </div>
      <div className="stat-icon">
        <Icon size={22} />
      </div>
    </div>
  );
}

function FeatureItem({ Icon, children }) {
  return (
    <div className="feature-item">
      <Icon size={16} />
      <span>{children}</span>
    </div>
  );
}

export default function App() {
  const [reviews, setReviews] = useState(() => {
    const saved = window.localStorage.getItem("ttg-reviews-standalone");
    return saved ? JSON.parse(saved) : initialReviews;
  });

  const [form, setForm] = useState({
    orderCode: "",
    customerName: "",
    status: "Đã giao",
    deliveryTime: 5,
    staffAttitude: 5,
    cargoSafety: 5,
    overall: 5,
    issueType: "Không có",
    note: "",
  });

  const [lookupMessage, setLookupMessage] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    window.localStorage.setItem("ttg-reviews-standalone", JSON.stringify(reviews));
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (!search.trim()) return reviews;
    const keyword = search.toLowerCase();
    return reviews.filter(
      (r) =>
        r.orderCode.toLowerCase().includes(keyword) ||
        r.customerName.toLowerCase().includes(keyword) ||
        (r.note || "").toLowerCase().includes(keyword) ||
        (r.issueType || "").toLowerCase().includes(keyword)
    );
  }, [reviews, search]);

  const stats = useMemo(() => {
    const count = reviews.length || 1;
    const avg = (key) =>
      (reviews.reduce((sum, r) => sum + Number(r[key] || 0), 0) / count).toFixed(2);

    return {
      total: reviews.length,
      deliveryTime: avg("deliveryTime"),
      staffAttitude: avg("staffAttitude"),
      cargoSafety: avg("cargoSafety"),
      overall: avg("overall"),
      lowScoreCount: reviews.filter((r) => Number(r.overall) <= 3).length,
    };
  }, [reviews]);

  const urgentReviews = filteredReviews.filter((r) => Number(r.overall) <= 3);

  const handleLookupOrder = () => {
    const found = demoOrders.find(
      (o) => o.orderCode.toLowerCase() === form.orderCode.trim().toLowerCase()
    );

    if (found) {
      setForm((prev) => ({
        ...prev,
        orderCode: found.orderCode,
        status: found.status,
      }));

      setLookupMessage(
        `Đã tìm thấy mã đơn ${found.orderCode}. Khách hàng có thể tự nhập tên và gửi đánh giá.`
      );
    } else {
      setLookupMessage(
        "Không tìm thấy mã đơn hàng trong danh sách demo. Bạn vẫn có thể tự nhập tên và gửi đánh giá."
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.customerName.trim()) {
      setLookupMessage("Vui lòng nhập tên khách hàng trước khi gửi đánh giá.");
      return;
    }

    const newReview = {
      ...form,
      orderCode: form.orderCode.trim() || `TTG-NEW-${Date.now().toString().slice(-6)}`,
      customerName: form.customerName.trim(),
      note: form.note.trim(),
    };

    setReviews((prev) => [newReview, ...prev]);

    setLookupMessage(
      Number(newReview.overall) <= 3
        ? "Đánh giá đã được ghi nhận. Hệ thống đã đánh dấu phản hồi cần ưu tiên xử lý."
        : "Đánh giá đã được ghi nhận thành công và hiển thị trong danh sách phản hồi."
    );

    setForm({
      orderCode: "",
      customerName: "",
      status: "Đã giao",
      deliveryTime: 5,
      staffAttitude: 5,
      cargoSafety: 5,
      overall: 5,
      issueType: "Không có",
      note: "",
    });
  };

  return (
    <div className="page">
      <div className="container">
        <div className="top-grid">
          <div>
            <div className="top-bar">
              <TTGLogo />
              <Badge>Giải pháp đề xuất cho TTG</Badge>
            </div>
            <h1>Ứng dụng đánh giá chất lượng dịch vụ giao nhận khách hàng</h1>
            <p className="lead">
              Bản demo cho phép khách hàng tự nhập tên, mã đơn hàng, chấm điểm dịch vụ, gửi góp ý
              và hỗ trợ doanh nghiệp theo dõi phản hồi, thống kê chất lượng cũng như cảnh báo các
              đánh giá thấp để xử lý kịp thời.
            </p>
          </div>

          <div className="card">
            <div className="section-title">Chức năng chính</div>
            <div className="subtle small">Gợi ý giải pháp chuyển đổi số cho doanh nghiệp logistics</div>
            <div className="feature-list">
              <FeatureItem Icon={Package}>Khách hàng tự nhập tên, mã đơn hàng và gửi đánh giá</FeatureItem>
              <FeatureItem Icon={Star}>Chấm điểm 4 tiêu chí dịch vụ theo thang 1–5</FeatureItem>
              <FeatureItem Icon={MessageSquare}>
                Gửi góp ý và hiển thị ngay trong danh sách phản hồi
              </FeatureItem>
              <FeatureItem Icon={AlertTriangle}>Cảnh báo phản hồi thấp cần ưu tiên xử lý</FeatureItem>
              <FeatureItem Icon={QrCode}>Gợi ý tích hợp QR đánh giá sau giao hàng</FeatureItem>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <StatCard title="Tổng phản hồi" value={stats.total} subtitle="Khách hàng đã đánh giá" Icon={MessageSquare} />
          <StatCard title="Thời gian giao hàng" value={stats.deliveryTime} subtitle="Điểm trung bình / 5" Icon={Truck} />
          <StatCard title="Thái độ nhân viên" value={stats.staffAttitude} subtitle="Điểm trung bình / 5" Icon={Smile} />
          <StatCard title="An toàn hàng hóa" value={stats.cargoSafety} subtitle="Điểm trung bình / 5" Icon={ShieldCheck} />
          <StatCard title="Hài lòng chung" value={stats.overall} subtitle="Điểm trung bình / 5" Icon={Star} />
          <StatCard
            title="Phản hồi cần xử lý"
            value={stats.lowScoreCount}
            subtitle="Đánh giá từ 3 sao trở xuống"
            Icon={AlertTriangle}
          />
        </div>

        <div className="main-grid">
          <div className="left-column">
            <div className="card">
              <div className="section-title">Biểu mẫu đánh giá dịch vụ</div>
              <div className="subtle small">
                Khách hàng có thể tự nhập thông tin và gửi đánh giá sau khi sử dụng dịch vụ
              </div>

              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="two-col">
                  <div>
                    <label>Mã đơn hàng</label>
                    <div className="inline-inputs">
                      <input
                        value={form.orderCode}
                        onChange={(e) => setForm({ ...form, orderCode: e.target.value })}
                        placeholder="Có thể nhập mã đơn hoặc để trống"
                      />
                      <button type="button" className="button soft" onClick={handleLookupOrder}>
                        Tra cứu mã
                      </button>
                    </div>
                    {lookupMessage ? <div className="subtle small mt8">{lookupMessage}</div> : null}
                  </div>

                  <div>
                    <label>
                      Tên khách hàng <span style={{ color: "#dc2626" }}>*</span>
                    </label>
                    <input
                      value={form.customerName}
                      onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                      placeholder="Ví dụ: Nguyễn Văn A hoặc Công ty ABC"
                    />
                  </div>
                </div>

                <div>
                  <label>Trạng thái đơn hàng</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                {metrics.map(({ key, label, Icon }) => (
                  <div key={key} className="metric-box">
                    <div className="metric-head">
                      <div className="metric-left">
                        <div className="metric-icon">
                          <Icon size={18} />
                        </div>
                        <div className="metric-label">{label}</div>
                      </div>
                      <StarRating
                        value={form[key]}
                        onChange={(value) => setForm({ ...form, [key]: value })}
                      />
                    </div>
                  </div>
                ))}

                <div>
                  <label>Loại vấn đề phát sinh</label>
                  <select
                    value={form.issueType}
                    onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                  >
                    <option>Không có</option>
                    <option>Giao hàng chậm</option>
                    <option>Hàng hóa hư hỏng</option>
                    <option>Thái độ phục vụ</option>
                    <option>Cập nhật trạng thái</option>
                    <option>Khác</option>
                  </select>
                </div>

                <div>
                  <label>Góp ý thêm</label>
                  <textarea
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    placeholder="Khách hàng có thể ghi chú thêm về chất lượng dịch vụ..."
                  />
                </div>

                <div className="two-col">
                  <button type="submit" className="button primary">
                    Gửi đánh giá
                  </button>
                  <button type="button" className="button secondary">
                    <QrCode size={16} />
                    QR đánh giá
                  </button>
                </div>
              </form>
            </div>

            <div className="card">
              <div className="section-title">Bảng quản trị nhanh</div>
              <div className="subtle small">Gợi ý màn hình dành cho bộ phận chăm sóc khách hàng</div>
              <div className="feature-list">
                <FeatureItem Icon={ClipboardList}>Theo dõi lịch sử đánh giá theo từng đơn hàng</FeatureItem>
                <FeatureItem Icon={AlertTriangle}>
                  Đánh dấu các phản hồi dưới 3 sao để ưu tiên xử lý
                </FeatureItem>
                <FeatureItem Icon={BarChart3}>Tổng hợp báo cáo theo tuần / tháng</FeatureItem>
                <FeatureItem Icon={QrCode}>Tích hợp mã QR sau giao hàng để tăng tỷ lệ phản hồi</FeatureItem>
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="card">
              <div className="list-header">
                <div>
                  <div className="section-title">Danh sách phản hồi gần nhất</div>
                  <div className="subtle small">
                    Doanh nghiệp có thể theo dõi phản hồi để cải thiện dịch vụ
                  </div>
                </div>

                <div className="search-wrap">
                  <Search size={16} />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm theo mã đơn, tên khách hàng..."
                  />
                </div>
              </div>

              <div className="review-list">
                {filteredReviews.map((review, index) => (
                  <div key={`${review.orderCode}-${index}`} className="review-card">
                    <div className="review-top">
                      <div>
                        <div className="review-name">{review.customerName}</div>
                        <div className="subtle small">Mã đơn hàng: {review.orderCode}</div>
                        <div className="subtle small">Trạng thái: {review.status}</div>
                      </div>

                      <div className="badge-row">
                        <Badge>Hài lòng: {review.overall}/5</Badge>
                        {Number(review.overall) <= 3 ? <Badge tone="amber">Cần xử lý</Badge> : null}
                      </div>
                    </div>

                    <div className="review-grid">
                      <div>Thời gian giao hàng: <strong>{review.deliveryTime}/5</strong></div>
                      <div>Thái độ nhân viên: <strong>{review.staffAttitude}/5</strong></div>
                      <div>An toàn hàng hóa: <strong>{review.cargoSafety}/5</strong></div>
                      <div>Loại vấn đề: <strong>{review.issueType}</strong></div>
                    </div>

                    {review.note ? <div className="note-box">“{review.note}”</div> : null}
                  </div>
                ))}

                {filteredReviews.length === 0 ? (
                  <div className="empty-box">Không có phản hồi nào khớp với từ khóa tìm kiếm.</div>
                ) : null}
              </div>
            </div>

            <div className="card">
              <div className="section-title">Cảnh báo phản hồi cần ưu tiên xử lý</div>
              <div className="subtle small">
                Các đánh giá thấp giúp doanh nghiệp theo dõi và liên hệ lại với khách hàng
              </div>

              <div className="urgent-list">
                {urgentReviews.length > 0 ? (
                  urgentReviews.map((review, index) => (
                    <div key={`${review.orderCode}-urgent-${index}`} className="urgent-card">
                      <div>
                        <div className="review-name">{review.customerName}</div>
                        <div className="subtle small">
                          Mã đơn: {review.orderCode} • Vấn đề: {review.issueType}
                        </div>
                      </div>
                      <Badge tone="amber">{review.overall}/5 sao</Badge>
                    </div>
                  ))
                ) : (
                  <div className="empty-box">Hiện chưa có phản hồi nào ở mức cảnh báo.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
