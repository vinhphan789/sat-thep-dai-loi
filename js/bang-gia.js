/* =========================================================
   BẢNG GIÁ SẮT THÉP
   Muốn đổi giá: chỉ cần sửa DON_GIA (đồng/kg) và NGAY_CAP_NHAT.
   Giá mỗi cây = trọng lượng cây 6m × đơn giá/kg (làm tròn 100đ).
   ========================================================= */

var NGAY_CAP_NHAT = "14/10/2026";

var DON_GIA = {
  hopDen: 17800,    // thép hộp đen (đ/kg)
  hopMaKem: 18500,  // thép hộp mạ kẽm (đ/kg)
  ongDen: 18000,    // thép ống đen (đ/kg)
  ongMaKem: 18800   // thép ống mạ kẽm (đ/kg)
};

var CHIEU_DAI = 6; // mét / cây

// Quy cách và các độ dày (mm) đang bán
var HOP_VUONG = [
  { canh: 12, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { canh: 14, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5] },
  { canh: 16, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { canh: 20, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8] },
  { canh: 25, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { canh: 30, dayList: [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { canh: 40, dayList: [0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { canh: 50, dayList: [1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { canh: 60, dayList: [1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { canh: 75, dayList: [1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { canh: 90, dayList: [1.5, 1.8, 2.0, 2.5, 3.0] },
  { canh: 100, dayList: [1.8, 2.0, 2.5, 3.0, 3.5, 4.0] }
];

var HOP_CHU_NHAT = [
  { a: 10, b: 30, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2] },
  { a: 13, b: 26, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4] },
  { a: 20, b: 40, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 25, b: 50, dayList: [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { a: 30, b: 60, dayList: [0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { a: 40, b: 80, dayList: [1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 50, b: 100, dayList: [1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { a: 60, b: 120, dayList: [1.8, 2.0, 2.5, 3.0, 3.5] }
];

var ONG_TRON = [
  { phi: 21.2, dayList: [0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { phi: 26.65, dayList: [0.8, 0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0] },
  { phi: 33.5, dayList: [0.9, 1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { phi: 42.2, dayList: [1.0, 1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5] },
  { phi: 48.1, dayList: [1.1, 1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { phi: 59.9, dayList: [1.2, 1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { phi: 75.6, dayList: [1.4, 1.5, 1.8, 2.0, 2.5, 3.0] },
  { phi: 88.3, dayList: [1.5, 1.8, 2.0, 2.5, 3.0, 3.5] },
  { phi: 113.5, dayList: [1.8, 2.0, 2.5, 3.0, 3.5, 4.0] }
];

/* ---------- Công thức trọng lượng (kg/m, thép 7,85 g/cm³) ---------- */

// Hộp: (2 × (A + B) − 4 × t) × t × 0,00785
function kgMetHop(a, b, t) {
  return (2 * (a + b) - 4 * t) * t * 0.00785;
}

// Ống tròn: (D − t) × t × 0,02466
function kgMetOng(d, t) {
  return (d - t) * t * 0.02466;
}

/* ---------- Định dạng số kiểu Việt Nam ---------- */

function soThapPhan(n, chuSo) {
  return n.toLocaleString("vi-VN", { maximumFractionDigits: chuSo });
}

function tienVND(n) {
  return (Math.round(n / 100) * 100).toLocaleString("vi-VN");
}

/* ---------- Dựng bảng ---------- */

function dungBang(tieuDeCot, nhom, giaDen, giaMaKem) {
  var html = '<div class="table-wrap"><table class="price-table"><thead><tr>' +
    "<th>Quy cách</th><th>Độ dày (mm)</th><th>Trọng lượng (kg/6m)</th>" +
    "<th>" + tieuDeCot[0] + "<br><small>(VNĐ/cây 6m)</small></th>" +
    "<th>" + tieuDeCot[1] + "<br><small>(VNĐ/cây 6m)</small></th>" +
    "</tr></thead><tbody>";

  nhom.forEach(function (g) {
    g.dayList.forEach(function (t, i) {
      var kg = g.kgMet(t) * CHIEU_DAI;
      html += "<tr>";
      if (i === 0) {
        html += '<th scope="rowgroup" rowspan="' + g.dayList.length + '">' + g.ten + "</th>";
      }
      html += "<td>" + soThapPhan(t, 2) + "</td>" +
        "<td>" + soThapPhan(kg, 2) + "</td>" +
        "<td>" + tienVND(kg * giaDen) + "</td>" +
        "<td>" + tienVND(kg * giaMaKem) + "</td></tr>";
    });
  });

  return html + "</tbody></table></div>";
}

var hopVuong = HOP_VUONG.map(function (s) {
  return {
    ten: "Hộp " + s.canh + "×" + s.canh,
    dayList: s.dayList,
    kgMet: function (t) { return kgMetHop(s.canh, s.canh, t); }
  };
});

var hopChuNhat = HOP_CHU_NHAT.map(function (s) {
  return {
    ten: "Hộp " + s.a + "×" + s.b,
    dayList: s.dayList,
    kgMet: function (t) { return kgMetHop(s.a, s.b, t); }
  };
});

var ongTron = ONG_TRON.map(function (s) {
  return {
    ten: "Ống phi " + soThapPhan(s.phi, 2),
    dayList: s.dayList,
    kgMet: function (t) { return kgMetOng(s.phi, t); }
  };
});

document.getElementById("bang-hop-vuong").innerHTML =
  dungBang(["Giá hộp vuông đen", "Giá hộp vuông mạ kẽm"], hopVuong, DON_GIA.hopDen, DON_GIA.hopMaKem);

document.getElementById("bang-hop-chu-nhat").innerHTML =
  dungBang(["Giá hộp chữ nhật đen", "Giá hộp chữ nhật mạ kẽm"], hopChuNhat, DON_GIA.hopDen, DON_GIA.hopMaKem);

document.getElementById("bang-ong-tron").innerHTML =
  dungBang(["Giá ống đen", "Giá ống mạ kẽm"], ongTron, DON_GIA.ongDen, DON_GIA.ongMaKem);

document.getElementById("ngay-cap-nhat").textContent = NGAY_CAP_NHAT;

/* ---------- Chuyển tab ---------- */

var tabs = document.querySelectorAll(".price-tabs button");
tabs.forEach(function (btn) {
  btn.addEventListener("click", function () {
    tabs.forEach(function (b) {
      var chon = b === btn;
      b.setAttribute("aria-selected", chon);
      document.getElementById(b.getAttribute("aria-controls")).hidden = !chon;
    });
  });
});
