import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

// --- COLORS FOR PIE CHART (More vibrant palette) ---
const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

// ==========================================
// 📈 ANALYTICS PAGE COMPONENT
// ==========================================
const AnalyticsPage = ({ data }) => {
  const [labelKey, setLabelKey] = useState("");
  const [valueKey, setValueKey] = useState("");

  useEffect(() => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const defaultLabel = keys.find((k) => typeof data[0][k] === "string") || keys[0];
      const defaultValue = keys.find((k) => !isNaN(parseFloat(data[0][k])) && k !== defaultLabel) || keys[1] || keys[0];
      setLabelKey(defaultLabel);
      setValueKey(defaultValue);
    }
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-10 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 shadow-2xl">
        <span className="text-4xl mb-4">📊</span>
        <p className="text-gray-400 text-lg font-medium">No data found. Run a query first!</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    [valueKey]: parseFloat(item[valueKey]) || 0
  }));

  const keys = Object.keys(data[0]);

  const legendStyle = {
    paddingTop: "20px",
    overflowY: "auto",
    maxHeight: "100px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#e5e7eb",
    scrollbarWidth: "thin",
    scrollbarColor: "#4b5563 transparent"
  };

  return (
    <div className="mt-8 animate-fade-in">
      {/* SELECTORS - Glassmorphism */}
      <div className="flex flex-wrap gap-6 mb-8 bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs tracking-wider text-blue-400 font-semibold uppercase block mb-2">X-Axis (Labels)</label>
          <select value={labelKey} onChange={(e) => setLabelKey(e.target.value)} className="w-full bg-black/40 p-3 rounded-xl border border-white/10 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all hover:bg-black/60 cursor-pointer">
            {keys.map(k => <option key={k} value={k} className="bg-gray-900">{k}</option>)}
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs tracking-wider text-green-400 font-semibold uppercase block mb-2">Y-Axis (Values)</label>
          <select value={valueKey} onChange={(e) => setValueKey(e.target.value)} className="w-full bg-black/40 p-3 rounded-xl border border-white/10 text-sm focus:ring-2 focus:ring-green-500/50 outline-none transition-all hover:bg-black/60 cursor-pointer">
            {keys.map(k => <option key={k} value={k} className="bg-gray-900">{k}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* BAR CHART */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[550px] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-50"></div>
          <h3 className="text-center mb-6 text-xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-extrabold tracking-wide">Bar Analysis</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey={labelKey} stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: '12px', color: '#fff' }} />
                <Legend wrapperStyle={legendStyle} verticalAlign="bottom" />
                <Bar dataKey={valueKey} fill="url(#blueGradient)" radius={[6, 6, 0, 0]} name={valueKey} animationDuration={1500} />
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIE CHART */}
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[550px] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600 opacity-50"></div>
          <h3 className="text-center mb-6 text-xl text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-extrabold tracking-wide">Distribution</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey={valueKey}
                  nameKey={labelKey}
                  cx="50%"
                  cy="45%"
                  innerRadius={80} // Converted to Donut chart for a more modern look
                  outerRadius={110}
                  paddingAngle={5}
                  stroke="none"
                  animationDuration={1500}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="hover:opacity-80 transition-opacity duration-300 outline-none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "rgba(17, 24, 39, 0.8)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: '12px' }} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🏠 MAIN APP COMPONENT
// ==========================================
function App() {
  const [query, setQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ branch: "", subject: "" });
  const [history, setHistory] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("queries")) || [];
    setHistory(saved);
  }, []);

  const saveHistory = (q) => {
    const updated = [q, ...history.filter(item => item !== q).slice(0, 4)];
    setHistory(updated);
    localStorage.setItem("queries", JSON.stringify(updated));
  };

  const runQuery = async () => {
    try {
      setLoading(true);
      let cleanQuery = query.trim().replace(/\n/g, " ").replace(/\s+/g, " ").replace(/;$/, "");
      if (!cleanQuery) return;
      saveHistory(cleanQuery);
      const res = await axios.post("http://localhost:5000/query", { query: cleanQuery });
      setData(res.data);
      setCurrentPage(1);
    } catch (err) {
      alert("Query failed ❌");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let q = "SELECT * FROM students WHERE 1=1";
    if (filters.branch) q += ` AND branch='${filters.branch}'`;
    if (filters.subject) q += ` AND subject='${filters.subject}'`;
    setQuery(q);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
    if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const filteredData = sortedData.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const downloadCSV = () => {
    if (!data.length) return;
    const csv = [Object.keys(data[0]).join(","), ...data.map((row) => Object.values(row).join(","))].join("\n");
    const blob = new Blob([csv]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "students_export.csv";
    a.click();
  };

  return (
    <Router>
      {/* Premium Dark Gradient Background */}
      <div className="min-h-screen bg-[#0b0f19] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
        
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 pb-6 border-b border-white/10">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                DataHub
              </span>
              <span className="text-gray-500 text-3xl ml-2 font-medium">Analytics</span>
            </h1>
            <nav className="flex gap-4 mt-6 md:mt-0 p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <Link to="/" className="hover:bg-white/10 px-5 py-2.5 rounded-xl transition-all font-medium text-gray-300 hover:text-white flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                Table
              </Link>
              <Link to="/charts" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-500/25 font-medium flex items-center gap-2 transform hover:scale-105">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                Charts
              </Link>
            </nav>
          </div>

          {/* QUERY EDITOR SECTION - Glassmorphism Card */}
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl mb-8 shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>

            {/* QUICK ACTIONS & FILTERS */}
            <div className="flex flex-col xl:flex-row justify-between gap-6 mb-6 relative z-10">
              <div className="flex gap-3 flex-wrap">
                <input placeholder="Branch" className="w-32 p-2.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-500 text-sm" onChange={(e) => setFilters({ ...filters, branch: e.target.value })} />
                <input placeholder="Subject" className="w-32 p-2.5 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder-gray-500 text-sm" onChange={(e) => setFilters({ ...filters, subject: e.target.value })} />
                <button onClick={applyFilters} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl transition-all text-sm font-medium border border-white/5 backdrop-blur-sm">
                  Apply Filter
                </button>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button onClick={() => setQuery("SELECT * FROM students ORDER BY marks DESC LIMIT 10")} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center gap-2">
                  🏆 Top 10
                </button>
                <button onClick={() => setQuery("SELECT * FROM students WHERE marks < 50")} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center gap-2">
                  ⚠️ Needs Review
                </button>
                <button onClick={() => setQuery("SELECT subject, AVG(marks) as avg_marks FROM students GROUP BY subject")} className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-4 py-2.5 rounded-xl transition-all text-sm font-medium flex items-center gap-2">
                  📊 Averages
                </button>
              </div>
            </div>

            {/* SQL EDITOR */}
            <div className="relative group z-10">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
              <textarea
                className="relative w-full p-5 bg-[#0d1117] border border-white/10 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-gray-200 resize-y shadow-inner"
                rows="3"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Write your SQL query here... e.g. SELECT * FROM students"
              />
            </div>

            {/* ACTIONS BAR */}
            <div className="flex justify-between items-center mt-6 flex-wrap gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <button onClick={runQuery} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {loading ? (
                    <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Executing...</>
                  ) : (
                    <>▶ Run Query</>
                  )}
                </button>
                <button onClick={downloadCSV} className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-3 rounded-xl transition-all border border-white/5 flex items-center gap-2 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export
                </button>
              </div>

              {/* LOCAL SEARCH IN RESULTS */}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input placeholder="Search results..." className="pl-10 p-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-sm w-64" onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            {/* HISTORY BADGES */}
            {history.length > 0 && (
              <div className="mt-6 flex gap-2 flex-wrap items-center relative z-10">
                <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider mr-2">Recent:</span>
                {history.map((h, i) => (
                  <button key={i} onClick={() => setQuery(h)} className="text-blue-300 hover:text-white bg-blue-500/10 hover:bg-blue-500/30 transition-colors text-xs px-3 py-1.5 rounded-full border border-blue-500/20 max-w-[200px] truncate">
                    {h}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================== */}
          {/* ROUTING LOGIC */}
          {/* ========================================== */}
          <Routes>
            <Route path="/" element={
              <div className="animate-fade-in">
                {/* KPI CARDS */}
                {data.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Total Rows</p>
                      <p className="text-4xl font-extrabold text-white">{data.length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all"></div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Columns Tracked</p>
                      <p className="text-4xl font-extrabold text-white">{Object.keys(data[0] || {}).length}</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-lg relative overflow-hidden group">
                      <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
                      <p className="text-gray-400 text-sm font-medium mb-1">Search Matches</p>
                      <p className="text-4xl font-extrabold text-white">{filteredData.length}</p>
                    </div>
                  </div>
                )}

                {/* PRO-LEVEL DATA TABLE */}
                {currentData.length > 0 ? (
                  <div className="mt-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-black/40 border-b border-white/10">
                          <tr>
                            {Object.keys(currentData[0]).map((key) => (
                              <th
                                key={key}
                                onClick={() => handleSort(key)}
                                className="p-4 text-xs font-semibold text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors group select-none"
                              >
                                <div className="flex items-center gap-2">
                                  {key} 
                                  <span className="text-gray-600 group-hover:text-blue-400 transition-colors">
                                    {sortConfig.key === key ? (sortConfig.direction === "asc" ? "↑" : "↓") : "↕"}
                                  </span>
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {currentData.map((row, i) => (
                            <tr key={i} className="hover:bg-white/5 transition-colors duration-150 group">
                              {Object.values(row).map((val, j) => (
                                <td key={j} className="p-4 text-sm text-gray-300 group-hover:text-white transition-colors">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* PREMIUM PAGINATION */}
                    {totalPages > 1 && (
                      <div className="flex justify-between items-center p-4 bg-black/20 border-t border-white/10">
                        <span className="text-xs text-gray-500">Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filteredData.length)} of {filteredData.length} entries</span>
                        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentPage(i + 1)}
                              className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-all ${
                                currentPage === i + 1 ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  !loading && query && <p className="text-center text-gray-500 mt-16 text-lg">Type a query and hit Run to see the magic happen ✨</p>
                )}
              </div>
            } />
            
            <Route path="/charts" element={<AnalyticsPage data={data} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;