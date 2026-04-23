import { useEffect, useState } from 'react';
import api from '../../services/api';
import './EntityModule.css';

export default function EntityModule({
  endpoint,
  title = 'Module',
  fields = [],
}) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null); // 🔥 NEW
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  /* =========================
     NORMALIZE ENDPOINT
  ========================= */
  const fixEndpoint = (ep) => {
    let clean = ep.toLowerCase().trim();

    if (clean.includes('prayer-requests')) return '/prayer';
    if (clean.includes('counselings')) return '/counseling';
    if (clean === '/member') return '/members';

    return clean.startsWith('/') ? clean : `/${clean}`;
  };

  const normalizedEndpoint = fixEndpoint(endpoint);

  /* =========================
     LOAD DATA
  ========================= */
  const load = async () => {
    try {
      setLoading(true);
      setError('');

      console.log("📡 Fetching:", normalizedEndpoint);

      const res = await api.get(normalizedEndpoint);

      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ LOAD ERROR:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to load data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [endpoint]);

  /* =========================
     HANDLE INPUT
  ========================= */
  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================
     SUBMIT (SMART)
  ========================= */
  const submit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');

      const hasFileField = fields.some(f => f.type === 'file');

      // 🔥 VALIDATION
      const requiredFields = fields.filter(f => f.required);
      for (let field of requiredFields) {
        if (!form[field.name]) {
          setError(`${field.label} is required`);
          return;
        }
      }

      // =========================
      // 🔥 FILE UPLOAD MODE
      // =========================
      if (hasFileField && file) {
        const formData = new FormData();

        Object.keys(form).forEach(key => {
          formData.append(key, form[key]);
        });

        formData.append("file", file);

        console.log("📤 UPLOAD:", normalizedEndpoint + "/upload");

        await api.post(`${normalizedEndpoint}/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

      } else {
        // =========================
        // NORMAL JSON
        // =========================
        console.log("📤 POST:", normalizedEndpoint, form);

        await api.post(normalizedEndpoint, form);
      }

      setForm({});
      setFile(null);
      load();

    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Save failed'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="entity-module">

      {/* FORM */}
      <section className="panel-card">
        <h2>{title}</h2>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submit}>
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>

              {/* 🔥 FILE INPUT */}
              {f.type === 'file' ? (
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              ) : f.type === 'textarea' ? (
                <textarea
                  value={form[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                >
                  <option value="">Select</option>
                  {f.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.name] || ''}
                  onChange={(e) => handleChange(f.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <button disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </form>
      </section>

      {/* LIST */}
      <section className="panel-card">
        <h3>Records</h3>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No records found</p>
        ) : (
          <table>
            <thead>
              <tr>
                {fields.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {fields.map((f) => (
                    <td key={f.name}>
                      {f.type === 'file' && item.fileUrl ? (
                        <a
                          href={`http://localhost:5000${item.fileUrl}`}
                          target="_blank"
                        >
                          View File
                        </a>
                      ) : (
                        item[f.name] ?? '-'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

    </div>
  );
}