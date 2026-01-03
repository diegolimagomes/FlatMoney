
import React, { useState } from 'react';
import { MonthData } from '../types';
import { exportToCSV } from '../utils/calculations';

interface SyncSettingsProps {
  data: MonthData[];
  onImport: (newData: MonthData[]) => void;
}

const SyncSettings: React.FC<SyncSettingsProps> = ({ data, onImport }) => {
  const [syncCode, setSyncCode] = useState('');
  const [showImport, setShowImport] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateSyncCode = () => {
    const code = btoa(JSON.stringify(data));
    navigator.clipboard.writeText(code);
    setFeedback('Código de Sincronização copiado!');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleImport = () => {
    try {
      const decodedData = JSON.parse(atob(syncCode));
      if (Array.isArray(decodedData)) {
        if (confirm("Isso substituirá seus dados atuais. Continuar?")) {
          onImport(decodedData);
          setFeedback('Dados importados com sucesso!');
          setSyncCode('');
          setShowImport(false);
        }
      } else {
        throw new Error();
      }
    } catch (e) {
      alert("Código de sincronização inválido.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <i className="fa-solid fa-file-excel text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Relatórios e Planilhas</h2>
            <p className="text-sm text-slate-400">Exporte seus dados para uso externo.</p>
          </div>
        </div>

        <button 
          onClick={() => exportToCSV(data)}
          className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-2xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-download text-emerald-500"></i>
            <span className="font-bold text-slate-700">Baixar Planilha (Excel/CSV)</span>
          </div>
          <i className="fa-solid fa-chevron-right text-slate-300 group-hover:translate-x-1 transition-transform"></i>
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <i className="fa-solid fa-sync text-xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">Sincronizar Dispositivos</h2>
            <p className="text-sm text-slate-400">Mova seus dados entre celular e computador.</p>
          </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={generateSyncCode}
            className="w-full flex items-center justify-between p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-copy"></i>
              <span className="font-bold">Gerar Código de Sincronização</span>
            </div>
            {feedback && <span className="text-[10px] bg-white/20 px-2 py-1 rounded-lg uppercase">Copiado!</span>}
          </button>

          <button 
            onClick={() => setShowImport(!showImport)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all"
          >
            <span>Importar de outro dispositivo</span>
            <i className={`fa-solid ${showImport ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
          </button>

          {showImport && (
            <div className="pt-4 space-y-3 animate-fadeIn">
              <textarea 
                value={syncCode}
                onChange={(e) => setSyncCode(e.target.value)}
                placeholder="Cole aqui o código gerado no outro aparelho..."
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <button 
                onClick={handleImport}
                disabled={!syncCode}
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50"
              >
                Confirmar Importação
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
        <i className="fa-solid fa-shield-halved text-amber-500 text-xl pt-1"></i>
        <div className="text-sm text-amber-800">
          <p className="font-bold mb-1">Dica de Segurança</p>
          <p className="opacity-80">Seus dados são salvos apenas neste navegador. Recomendamos exportar um backup mensalmente para garantir que nunca perca seu histórico.</p>
        </div>
      </div>
    </div>
  );
};

export default SyncSettings;
