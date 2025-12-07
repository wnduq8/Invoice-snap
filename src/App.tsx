import { useState, useRef, type ChangeEvent } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Building2,
  User,
  Moon,
  Sun,
  X,
  Upload,
  Eye,
  Mail,
  Phone,
  MapPin,
  Hash,
} from "lucide-react";

import { type ContactInfo, type InvoiceItem, type Lang } from "./types";
import { translations } from "./locale";
import InputField from "./components/InputField";

export default function InvoiceSnap() {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<Lang>("ko");
  const [showModal, setShowModal] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);
  const [seller, setSeller] = useState<ContactInfo>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [buyer, setBuyer] = useState<ContactInfo>({
    name: "",
    email: "",
    address: "",
    phone: "",
  });
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, price: 0 },
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState("");
  const [taxRate, setTaxRate] = useState(10);
  const previewRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const subtotal = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  const muted = dark ? "text-gray-400" : "text-gray-500";

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat(
      lang === "ko"
        ? "ko-KR"
        : lang === "ja"
        ? "ja-JP"
        : lang === "zh"
        ? "zh-CN"
        : "en-US",
      {
        style: "currency",
        currency:
          lang === "ko"
            ? "KRW"
            : lang === "ja"
            ? "JPY"
            : lang === "zh"
            ? "CNY"
            : "USD",
      }
    ).format(n);

  const handleLogo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = (ev) => setLogo(ev.target?.result as string);
      r.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    const content = previewRef.current;
    if (!content) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>${t.invoice}</title><style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:48px;color:#1f2937;line-height:1.5}
        .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #e5e7eb}
        .logo{max-height:56px;margin-right:16px}.brand{display:flex;align-items:center}
        .title{font-size:32px;font-weight:700;color:#2563eb}.inv-num{color:#6b7280;font-size:14px}
        .meta{text-align:right;font-size:13px;color:#4b5563}
        .parties{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px}
        .party{background:#f8fafc;border-radius:12px;padding:20px;border-left:4px solid}
        .party.seller{border-color:#2563eb}.party.buyer{border-color:#10b981}
        .party-title{font-weight:600;font-size:15px;margin-bottom:12px;display:flex;align-items:center;gap:8px}
        .party.seller .party-title{color:#2563eb}.party.buyer .party-title{color:#10b981}
        .info-row{display:flex;gap:12px;font-size:13px;margin-bottom:6px}
        .info-label{color:#6b7280;min-width:80px}.info-value{color:#1f2937;font-weight:500}
        table{width:100%;border-collapse:collapse;margin-bottom:32px}
        th{background:#2563eb;color:white;padding:12px 16px;text-align:left;font-size:13px;font-weight:600}
        th:first-child{border-radius:8px 0 0 0}th:last-child{border-radius:0 8px 0 0}
        td{padding:12px 16px;font-size:13px;border-bottom:1px solid #e5e7eb}
        tr:nth-child(even){background:#f8fafc}
        .text-center{text-align:center}.text-right{text-align:right}
        .summary{display:flex;justify-content:flex-end}
        .summary-box{width:280px;background:linear-gradient(135deg,#eff6ff,#eef2ff);border-radius:12px;padding:20px}
        .sum-row{display:flex;justify-content:space-between;padding:8px 0;font-size:14px;border-bottom:1px solid #ddd6fe}
        .sum-label{color:#6b7280}.sum-value{font-weight:500}
        .total-row{display:flex;justify-content:space-between;padding-top:16px;margin-top:8px;border-top:2px solid #2563eb}
        .total-label{font-size:18px;font-weight:700;color:#2563eb}.total-value{font-size:24px;font-weight:700;color:#2563eb}
      </style></head><body>${content.innerHTML}</body></html>`);
      w.document.close();
      w.print();
    }
  };

  const addItem = () =>
    setItems([
      ...items,
      { id: Date.now(), description: "", quantity: 1, price: 0 },
    ]);

  const removeItem = (id: number) =>
    items.length > 1 && setItems(items.filter((i) => i.id !== id));

  const updateItem = <K extends keyof InvoiceItem>(
    id: number,
    field: K,
    value: InvoiceItem[K]
  ) => setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  const InfoRow = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: string;
  }) => (
    <div className="info-row flex items-center gap-2 mb-2">
      <Icon size={14} className="text-gray-400 flex-shrink-0" />
      <span className="info-label text-gray-500 text-sm w-15 flex-shrink-0">
        {label}
      </span>
      <span className="info-value text-sm font-medium text-gray-800 break-all">
        {value || "-"}
      </span>
    </div>
  );

  const PreviewContent = ({ forPrint = false }: { forPrint?: boolean }) => (
    <div ref={forPrint ? previewRef : null} className={forPrint ? "" : "p-6"}>
      <div className="header flex justify-between items-start mb-8 pb-5 border-b-2 border-gray-200">
        <div className="brand flex items-center gap-4">
          {logo && (
            <img
              src={logo}
              alt="Logo"
              className="logo max-h-14 object-contain"
            />
          )}
          <div>
            <h1 className="title text-3xl font-bold text-blue-600">
              {t.invoice}
            </h1>
            <p className="inv-num text-gray-500 text-sm mt-1">
              {invoiceNumber}
            </p>
          </div>
        </div>
        <div className="meta text-right text-sm text-gray-600">
          <p className="mb-1">
            <span className="text-gray-400">{t.issueDate}:</span>{" "}
            <strong>{invoiceDate}</strong>
          </p>
          {dueDate && (
            <p>
              <span className="text-gray-400">{t.dueDate}:</span>{" "}
              <strong>{dueDate}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="parties grid grid-cols-2 gap-6 mb-8">
        <div className="party seller bg-slate-50 rounded-xl p-5 border-l-4 border-blue-600">
          <h3 className="party-title text-blue-600 font-semibold mb-3 flex items-center gap-2">
            <Building2 size={18} />
            {t.seller}
          </h3>
          <InfoRow icon={Hash} label={t.companyName} value={seller.name} />
          <InfoRow icon={Mail} label={t.email} value={seller.email} />
          <InfoRow icon={Phone} label={t.phone} value={seller.phone} />
          <InfoRow icon={MapPin} label={t.address} value={seller.address} />
        </div>
        <div className="party buyer bg-slate-50 rounded-xl p-5 border-l-4 border-emerald-500">
          <h3 className="party-title text-emerald-600 font-semibold mb-3 flex items-center gap-2">
            <User size={18} />
            {t.buyer}
          </h3>
          <InfoRow icon={Hash} label={t.companyName} value={buyer.name} />
          <InfoRow icon={Mail} label={t.email} value={buyer.email} />
          <InfoRow icon={Phone} label={t.phone} value={buyer.phone} />
          <InfoRow icon={MapPin} label={t.address} value={buyer.address} />
        </div>
      </div>

      <table className="w-full mb-8">
        <thead>
          <tr>
            <th className="bg-blue-600 text-white p-3 text-left text-sm font-semibold rounded-tl-lg">
              {t.itemName}
            </th>
            <th className="bg-blue-600 text-white p-3 text-center text-sm font-semibold w-20">
              {t.quantity}
            </th>
            <th className="bg-blue-600 text-white p-3 text-right text-sm font-semibold w-28">
              {t.unitPrice}
            </th>
            <th className="bg-blue-600 text-white p-3 text-right text-sm font-semibold w-32 rounded-tr-lg">
              {t.amount}
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={item.id}
              className={idx % 2 === 0 ? "bg-slate-50" : "bg-white"}
            >
              <td className="p-3 text-sm border-b border-gray-100">
                {item.description || "-"}
              </td>
              <td className="p-3 text-sm text-center border-b border-gray-100">
                {item.quantity}
              </td>
              <td className="p-3 text-sm text-right border-b border-gray-100">
                {formatCurrency(item.price)}
              </td>
              <td className="p-3 text-sm text-right font-semibold border-b border-gray-100">
                {formatCurrency(item.quantity * item.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary flex justify-end">
        <div className="summary-box w-72 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 shadow-sm">
          <div className="sum-row flex justify-between py-2 border-b border-indigo-100">
            <span className="sum-label text-gray-500">{t.subtotal}</span>
            <span className="sum-value font-semibold">
              {formatCurrency(subtotal)}
            </span>
          </div>
          <div className="sum-row flex justify-between py-2 border-b border-indigo-100">
            <span className="sum-label text-gray-500">
              {t.tax} ({taxRate}%)
            </span>
            <span className="sum-value font-semibold">
              {formatCurrency(tax)}
            </span>
          </div>
          <div className="total-row flex justify-between items-center pt-4 mt-2 border-t-2 border-blue-600">
            <span className="total-label text-xl font-bold text-blue-600">
              {t.total}
            </span>
            <span className="total-value text-2xl font-bold text-blue-600">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const input = dark
    ? "bg-gray-700 border-gray-600 text-white"
    : "bg-white border-gray-200";

  return (
    <div
      className={`min-h-screen p-4 transition-colors ${
        dark ? "bg-gray-900" : "bg-gradient-to-br from-slate-100 to-blue-100"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FileText className="text-white" size={24} />
            </div>
            <div>
              <h1
                className={`text-xl font-bold ${
                  dark ? "text-white" : "text-gray-900"
                }`}
              >
                {t.title}
              </h1>
              <p className={`text-xs ${muted}`}>{t.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className={`px-2 py-1.5 rounded-lg text-sm border ${input}`}
            >
              <option value="ko">🇰🇷 한국어</option>
              <option value="en">🇺🇸 EN</option>
              <option value="ja">🇯🇵 日本語</option>
              <option value="zh">🇨🇳 中文</option>
            </select>
            <button
              onClick={() => setDark(!dark)}
              className={`p-2 rounded-lg ${
                dark
                  ? "bg-gray-700 text-yellow-400"
                  : "bg-white text-gray-600 shadow-sm"
              }`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Form */}
          <div
            className={`lg:w-5/12 ${
              dark ? "bg-gray-800" : "bg-white"
            } rounded-2xl p-5 shadow-lg`}
          >
            {/* Logo Upload */}
            <div className="flex items-center gap-3 mb-4">
              <label
                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm ${
                  dark
                    ? "bg-blue-700 hover:bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <Upload size={16} />
                {t.uploadLogo}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogo}
                  className="hidden"
                />
              </label>
              {logo && (
                <>
                  <img src={logo} alt="Logo" className="h-8 object-contain" />
                  <button
                    onClick={() => setLogo(null)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    {t.removeLogo}
                  </button>
                </>
              )}
            </div>

            {/* Invoice Info */}
            <div
              className={`grid grid-cols-3 gap-3 mb-4 p-3 rounded-xl ${
                dark ? "bg-gray-700/50" : "bg-gray-50"
              }`}
            >
              <InputField
                label={t.invoiceNumber}
                value={invoiceNumber}
                onChange={setInvoiceNumber}
                dark={dark}
              />
              <InputField
                label={t.issueDate}
                type="date"
                value={invoiceDate}
                onChange={setInvoiceDate}
                dark={dark}
              />
              <InputField
                label={t.dueDate}
                type="date"
                value={dueDate}
                onChange={setDueDate}
                dark={dark}
              />
            </div>

            {/* Seller & Buyer */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div
                className={`p-3 rounded-xl border-2 border-dashed ${
                  dark
                    ? "border-blue-400/50 bg-blue-900/10"
                    : "border-blue-200 bg-blue-50/30"
                }`}
              >
                <h3 className="font-semibold text-blue-600 mb-2 text-sm flex items-center gap-1">
                  <Building2 size={14} />
                  {t.sellerInfo}
                </h3>
                <div className="space-y-2">
                  <InputField
                    label={t.companyName}
                    value={seller.name}
                    onChange={(v) => setSeller({ ...seller, name: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.email}
                    type="email"
                    value={seller.email}
                    onChange={(v) => setSeller({ ...seller, email: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.phone}
                    value={seller.phone}
                    onChange={(v) => setSeller({ ...seller, phone: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.address}
                    value={seller.address}
                    onChange={(v) => setSeller({ ...seller, address: v })}
                    dark={dark}
                  />
                </div>
              </div>
              <div
                className={`p-3 rounded-xl border-2 border-dashed ${
                  dark
                    ? "border-emerald-400/50 bg-emerald-900/10"
                    : "border-emerald-200 bg-emerald-50/30"
                }`}
              >
                <h3 className="font-semibold text-emerald-600 mb-2 text-sm flex items-center gap-1">
                  <User size={14} />
                  {t.buyerInfo}
                </h3>
                <div className="space-y-2">
                  <InputField
                    label={t.companyName}
                    value={buyer.name}
                    onChange={(v) => setBuyer({ ...buyer, name: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.email}
                    type="email"
                    value={buyer.email}
                    onChange={(v) => setBuyer({ ...buyer, email: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.phone}
                    value={buyer.phone}
                    onChange={(v) => setBuyer({ ...buyer, phone: v })}
                    dark={dark}
                  />
                  <InputField
                    label={t.address}
                    value={buyer.address}
                    onChange={(v) => setBuyer({ ...buyer, address: v })}
                    dark={dark}
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3
                  className={`font-semibold text-sm ${
                    dark ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t.items}
                </h3>
                <button
                  onClick={addItem}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs flex items-center gap-1 hover:bg-blue-700"
                >
                  <Plus size={14} />
                  {t.addItem}
                </button>
              </div>
              <div
                className={`rounded-xl overflow-hidden border ${
                  dark ? "border-gray-600" : "border-gray-200"
                }`}
              >
                <div
                  className={`grid grid-cols-12 gap-1 px-2 py-2 text-xs font-semibold ${
                    dark
                      ? "bg-gray-700 text-gray-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <div className="col-span-1 text-center">#</div>
                  <div className="col-span-5">{t.itemName}</div>
                  <div className="col-span-2 text-center">{t.quantity}</div>
                  <div className="col-span-2 text-right">{t.unitPrice}</div>
                  <div className="col-span-2 text-right">{t.amount}</div>
                </div>
                {items.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`grid grid-cols-12 gap-1 px-2 py-2 items-center border-t ${
                      dark
                        ? "border-gray-700 bg-gray-800"
                        : "border-gray-100 bg-white"
                    }`}
                  >
                    <div className={`col-span-1 text-center text-xs ${muted}`}>
                      {idx + 1}
                    </div>
                    <div className="col-span-5">
                      <input
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, "description", e.target.value)
                        }
                        placeholder={t.itemName}
                        className={`w-full px-2 py-1 border rounded text-sm ${input}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, "quantity", +e.target.value || 0)
                        }
                        min="1"
                        className={`w-full px-1 py-1 border rounded text-sm text-center ${input}`}
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          updateItem(item.id, "price", +e.target.value || 0)
                        }
                        className={`w-full px-1 py-1 border rounded text-sm text-right ${input}`}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-1">
                      <span
                        className={`text-xs font-semibold ${
                          dark ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {formatCurrency(item.quantity * item.price)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-0.5 text-red-400 hover:text-red-600"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div
              className={`flex justify-between items-end p-4 rounded-xl ${
                dark
                  ? "bg-gray-700"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50"
              }`}
            >
              <div>
                <label
                  className={`block text-xs font-medium ${
                    dark ? "text-white" : muted
                  } mb-1`}
                >
                  {t.taxRate} (%)
                </label>
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(+e.target.value || 0)}
                  className={`w-20 px-2 py-1.5 border rounded text-sm ${input}`}
                />
              </div>
              <div className="text-right">
                <div className="flex justify-between gap-6 text-sm">
                  <span className={dark ? "text-white" : muted}>
                    {t.subtotal}
                  </span>
                  <span className={dark ? "text-white" : "font-medium"}>
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 text-sm">
                  <span className={dark ? "text-white" : muted}>{t.tax}</span>
                  <span className={dark ? "text-white" : "font-medium"}>
                    {formatCurrency(tax)}
                  </span>
                </div>
                <div className="flex justify-between gap-6 text-xl font-bold text-blue-600 border-t border-blue-200 mt-2 pt-2">
                  <span className={dark ? "text-white" : "text-blue-600"}>
                    {t.total}
                  </span>
                  <span className={dark ? "text-white" : "text-blue-600"}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Preview Button */}
            <button
              onClick={() => setShowModal(true)}
              className="lg:hidden mt-4 w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
            >
              <Eye size={18} />
              {t.preview}
            </button>
          </div>

          {/* Right: Preview */}
          <div className="hidden lg:block lg:w-7/12">
            <div
              className={`${
                dark ? "bg-gray-800" : "bg-white"
              } rounded-2xl shadow-lg sticky top-4 overflow-hidden`}
            >
              <div
                className={`px-5 py-3 border-b ${
                  dark
                    ? "border-gray-700 bg-gray-700/50"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <h2
                  className={`font-semibold ${
                    dark ? "text-white" : "text-gray-700"
                  }`}
                >
                  {t.preview}
                </h2>
              </div>
              <div
                className={`${
                  dark ? "bg-white" : ""
                } m-4 rounded-xl overflow-hidden shadow-inner`}
              >
                <PreviewContent />
              </div>
              <div
                className={`p-4 border-t ${
                  dark ? "border-gray-700" : "border-gray-100"
                }`}
              >
                <button
                  onClick={handlePrint}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 font-medium shadow-lg"
                >
                  <Download size={18} />
                  {t.download}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 lg:hidden">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
            <div className="sticky top-0 flex justify-between items-center p-4 border-b bg-white">
              <h3 className="font-semibold">{t.preview}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <PreviewContent />
            <div className="sticky bottom-0 p-4 border-t bg-white">
              <button
                onClick={handlePrint}
                className="w-full py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-medium"
              >
                <Download size={18} />
                {t.download}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="hidden">
        <PreviewContent forPrint />
      </div>
    </div>
  );
}
