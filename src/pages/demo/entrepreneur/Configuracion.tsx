import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Configuracion() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState('');
  
  useEffect(() => {
    const saved = localStorage.getItem('business_config');
    if (saved) {
      const config = JSON.parse(saved);
      setBusinessName(config.name || '');
    }
  }, []);
  
  const handleSave = () => {
    localStorage.setItem('business_config', JSON.stringify({
      name: businessName,
      updatedAt: new Date().toISOString()
    }));
    alert('✓ Configuración guardada');
  };
  
  const handleExport = () => {
    const data = {
      business_config: JSON.parse(localStorage.getItem('business_config') || '{}'),
      business_idea: localStorage.getItem('business_idea_text'),
      ai_analysis: JSON.parse(localStorage.getItem('ai_analysis') || 'null'),
      lean_canvas: JSON.parse(localStorage.getItem('lean_canvas_data') || '{}'),
      financial_simulation: JSON.parse(localStorage.getItem('financial_simulation') || 'null'),
      checklist_progress: JSON.parse(localStorage.getItem('checklist_progress') || '{}'),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mi-emprendimiento-${Date.now()}.json`;
    a.click();
  };
  
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (data.business_config) localStorage.setItem('business_config', JSON.stringify(data.business_config));
        if (data.business_idea) localStorage.setItem('business_idea_text', data.business_idea);
        if (data.ai_analysis) localStorage.setItem('ai_analysis', JSON.stringify(data.ai_analysis));
        if (data.lean_canvas) localStorage.setItem('lean_canvas_data', JSON.stringify(data.lean_canvas));
        if (data.financial_simulation) localStorage.setItem('financial_simulation', JSON.stringify(data.financial_simulation));
        if (data.checklist_progress) localStorage.setItem('checklist_progress', JSON.stringify(data.checklist_progress));
        
        alert('✓ Datos importados exitosamente');
        window.location.reload();
      } catch (error) {
        alert('Error al importar datos. Verifica el archivo.');
      }
    };
    reader.readAsText(file);
  };
  
  const handleClearAll = () => {
    if (confirm('¿Estás seguro? Esto borrará TODOS tus datos locales.')) {
      localStorage.clear();
      alert('✓ Todos los datos borrados');
      window.location.href = '/';
    }
  };
  
  return (
    <div className="md:ml-64 min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/demo/emprendedor/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold">⚙️ Configuración</h1>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Información del Negocio</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName" className="block text-sm font-semibold mb-2">
                Nombre del Emprendimiento
              </Label>
              <Input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej: Tortas Personalizadas BA"
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSave}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Save className="w-5 h-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold mb-4">Gestión de Datos</h2>
          <div className="space-y-4">
            <Button
              onClick={handleExport}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar Todos Mis Datos (JSON)
            </Button>
            
            <div>
              <label className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-5 h-5" />
                Importar Datos desde Archivo
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
            
            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Borrar Todos los Datos
            </Button>
          </div>
        </div>
        
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6">
          <h3 className="font-bold text-yellow-900 mb-2">⚠️ Modo Demo</h3>
          <p className="text-yellow-800 text-sm">
            Tus datos se guardan localmente en tu navegador. Si borras el caché o cambias de dispositivo, 
            perderás toda la información. Creá una cuenta para guardar todo en la nube de forma permanente.
          </p>
          <Button
            onClick={() => navigate('/auth')}
            className="mt-4 bg-yellow-600 hover:bg-yellow-700"
          >
            Crear Cuenta Ahora
          </Button>
        </div>
      </div>
    </div>
  );
}
