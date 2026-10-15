/* =========================================================
   DANH MỤC SẮT HỘP & TÔN (dải cuộn ngang)
   Muốn đổi giá sắt hộp: sửa DON_GIA (đồng/kg).
   Muốn đổi giá tôn: sửa trường "gia" trong danh sách TON.
   Muốn đổi ảnh: thêm trường anh: "images/ten-anh.jpg" cho từng mục.
   ========================================================= */

var DON_GIA = {
  hopDen: 17800,    // thép hộp đen (đ/kg)
  hopMaKem: 18500   // thép hộp mạ kẽm (đ/kg)
};

var CHIEU_DAI = 6; // mét / cây

// Ảnh tôn theo loại (nguồn & giấy phép ghi ở chân trang index.html)
var ANH_TON = {
  "Tôn lạnh màu": "images/ton-lanh-mau.jpg",
  "Tôn kẽm": "images/ton-kem.jpg"
};

// Quy cách và các độ dày (mm) đang bán. b bỏ trống = hộp vuông.
var SAT_HOP = [
  { a: 12, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { a: 14, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5] },
  { a: 16, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { a: 20, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8] },
  { a: 25, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 30, dayList: [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 40, dayList: [0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { a: 50, dayList: [1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 60, dayList: [1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 75, dayList: [1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 90, dayList: [1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 100, dayList: [1.8, 2.0, 2.5, 3.0, 3.5, 4.0] },
  { a: 10, b: 30, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2] },
  { a: 13, b: 26, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { a: 20, b: 40, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 25, b: 50, dayList: [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 30, b: 60, dayList: [0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { a: 40, b: 80, dayList: [1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 50, b: 100, dayList: [1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 60, b: 120, dayList: [1.8, 2.0, 2.5, 3.0, 3.5] }
];

// Tôn: độ dày (mm) và giá (đ/mét dài, khổ 1,07m). GIÁ TẠM – cần cập nhật.
var TON = [
  { loai: "Tôn lạnh màu", day: 0.30, gia: 75000 },
  { loai: "Tôn lạnh màu", day: 0.35, gia: 85000 },
  { loai: "Tôn lạnh màu", day: 0.40, gia: 95000 },
  { loai: "Tôn lạnh màu", day: 0.45, gia: 105000 },
  { loai: "Tôn lạnh màu", day: 0.50, gia: 115000 },
  { loai: "Tôn kẽm", day: 0.30, gia: 65000 },
  { loai: "Tôn kẽm", day: 0.35, gia: 75000 },
  { loai: "Tôn kẽm", day: 0.40, gia: 85000 },
  { loai: "Tôn kẽm", day: 0.45, gia: 95000 },
  { loai: "Tôn kẽm", day: 0.50, gia: 105000 }
];

/* ---------- Công thức trọng lượng (kg/m, thép 7,85 g/cm³) ---------- */

// Hộp: (2 × (A + B) − 4 × t) × t × 0,00785
function kgMetHop(a, b, t) {
  return (2 * (a + b) - 4 * t) * t * 0.00785;
}

/* ---------- Định dạng số kiểu Việt Nam ---------- */

function soThapPhan(n, chuSo) {
  return n.toLocaleString("vi-VN", { minimumFractionDigits: chuSo, maximumFractionDigits: chuSo });
}

function tienVND(n) {
  return (Math.round(n / 100) * 100).toLocaleString("vi-VN") + "đ";
}

/* ---------- Hình minh hoạ sắt hộp (SVG vẽ theo đúng tỉ lệ quy cách) ---------- */

function hinhHop(a, b) {
  var px = function (mm) { return 40 + mm * 1.1; };
  var w = px(b), h = px(a);           // mặt cắt: rộng = cạnh dài, cao = cạnh ngắn
  var dx = 150, dy = -75;             // chiều sâu của cây hộp
  var day = Math.max(3, Math.min(w, h) * 0.08);
  var x = (400 - w - dx) / 2, y = (300 - h + dy) / 2 - dy;
  var p = function (pts) { return pts.map(function (q) { return q.join(","); }).join(" "); };

  return '<svg viewBox="0 0 400 300" role="img" aria-label="Minh hoạ hộp ' + a + "×" + b + '">' +
    '<rect width="400" height="300" fill="#eef1f6"/>' +
    '<polygon fill="#b9c0cb" points="' + p([[x, y], [x + dx, y + dy], [x + w + dx, y + dy], [x + w, y]]) + '"/>' +
    '<polygon fill="#7d8694" points="' + p([[x + w, y], [x + w + dx, y + dy], [x + w + dx, y + h + dy], [x + w, y + h]]) + '"/>' +
    '<path fill="#5b6370" fill-rule="evenodd" d="M' + x + " " + y + "h" + w + "v" + h + "h-" + w + "z" +
      "M" + (x + day) + " " + (y + day) + "v" + (h - 2 * day) + "h" + (w - 2 * day) + "v-" + (h - 2 * day) + 'z"/>' +
    '<rect fill="#2b3038" x="' + (x + day) + '" y="' + (y + day) + '" width="' + (w - 2 * day) + '" height="' + (h - 2 * day) + '"/>' +
    "</svg>";
}

/* ---------- Dựng thẻ sản phẩm ---------- */

function theSanPham(sp) {
  return '<li class="card">' +
    '<div class="card-img">' +
      (sp.hinh || '<img src="' + sp.anh + '" alt="' + sp.ten + '" loading="lazy">') +
      '<span class="card-badge">' + sp.nhan + "</span>" +
    "</div>" +
    "<h3>" + sp.ten + "</h3>" +
    '<p class="card-desc">' + sp.moTa + "</p>" +
    '<p class="card-price">' + sp.gia + "</p>" +
    '<a href="https://zalo.me/0708005789" class="card-btn" target="_blank" rel="noopener">Đặt hàng</a>' +
    "</li>";
}

var theSatHop = SAT_HOP.map(function (s) {
  var b = s.b || s.a;
  var quyCach = s.a + "×" + b;
  var mong = s.dayList[0];
  var day = s.dayList[s.dayList.length - 1];
  var giaTu = kgMetHop(s.a, b, mong) * CHIEU_DAI * DON_GIA.hopDen;
  return theSanPham({
    anh: s.anh,
    hinh: s.anh ? "" : hinhHop(s.a, b),
    nhan: quyCach,
    ten: "Hộp " + (s.b ? "chữ nhật " : "vuông ") + quyCach,
    moTa: "Dày " + soThapPhan(mong, 1) + " – " + soThapPhan(day, 1) + " mm · cây 6m",
    gia: "Từ " + tienVND(giaTu) + "<small>/cây</small>"
  });
});

var theTon = TON.map(function (t) {
  var day = soThapPhan(t.day, 2);
  return theSanPham({
    anh: t.anh || ANH_TON[t.loai],
    nhan: day + " mm",
    ten: t.loai + " " + day + " mm",
    moTa: "Dày " + day + " mm · khổ 1,07m",
    gia: tienVND(t.gia) + "<small>/mét</small>"
  });
});

document.getElementById("ds-sat-hop").innerHTML = theSatHop.join("");
document.getElementById("ds-ton").innerHTML = theTon.join("");

/* ---------- Nút cuộn trái / phải ---------- */

document.querySelectorAll(".scroll-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var ds = document.getElementById(btn.getAttribute("aria-controls"));
    var huong = btn.dataset.huong === "trai" ? -1 : 1;
    ds.scrollBy({ left: huong * ds.clientWidth * 0.8, behavior: "smooth" });
  });
});
