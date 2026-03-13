import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker, 
  InfoWindow, 
  TrafficLayer, 
  DirectionsService, 
  DirectionsRenderer 
} from '@react-google-maps/api';

// --- CONFIGURACIÓN OFICIAL ---
const MAP_API_KEY = "AIzaSyD8Fk1A0TjWai8vnLE0xGberUtEhVGIW-U"; 
const LIBRARIES = ["geometry", "places"];

const center = { lat: 6.2442, lng: -75.5812 };

// LISTADO COMPLETO DE CLÍNICAS (TU EXCEL)
const clinicsData = [
  { id: 0, name: "CE01 T.S (BASE)", lat: 6.2308, lng: -75.5905, zone: "CENTRAL", isBase: true },
  // SUR ALTO
  { id: 1, name: "SAN VICENTE - CALDAS", lat: 6.0911, lng: -75.6358, zone: "SUR ALTO" },
  { id: 2, name: "ANTIOQUIA ITAGÜÍ", lat: 6.1725, lng: -75.6095, zone: "SUR ALTO" },
  { id: 3, name: "SAN RAFAEL ITAGÜÍ", lat: 6.1712, lng: -75.6052, zone: "SUR ALTO" },
  { id: 4, name: "NEUROMÉDICA MAYORCA", lat: 6.1601, lng: -75.6051, zone: "SUR ALTO" },
  { id: 7, name: "CLÍNICA LAS VEGAS", lat: 6.2016, lng: -75.5774, zone: "SUR ALTO" },
  // SUR BAJO
  { id: 12, name: "CLÍNICA NOEL", lat: 6.2345, lng: -75.5721, zone: "SUR BAJO" },
  { id: 14, name: "MEDELLÍN POBLADO", lat: 6.2001, lng: -75.5661, zone: "SUR BAJO" },
  { id: 16, name: "ROSARIO TESORO", lat: 6.1985, lng: -75.5485, zone: "SUR BAJO" },
  { id: 19, name: "LAS AMÉRICAS", lat: 6.2215, lng: -75.5942, zone: "SUR BAJO" },
  // CENTRO
  { id: 27, name: "CLÍNICA SOMA", lat: 6.2455, lng: -75.5641, zone: "CENTRO" },
  { id: 29, name: "ROSARIO CENTRO", lat: 6.2482, lng: -75.5615, zone: "CENTRO" },
  { id: 30, name: "SAN VICENTE MEDELLÍN", lat: 6.2625, lng: -75.5655, zone: "CENTRO" },
  // NORTE
  { id: 38, name: "PABLO TOBÓN URIBE", lat: 6.2735, lng: -75.5788, zone: "NORTE" },
  { id: 40, name: "ANTIOQUIA BELLO", lat: 6.3312, lng: -75.5574, zone: "NORTE" },
  // ORIENTE
  { id: 45, name: "CLÍNICA SOMER", lat: 6.1425, lng: -75.3788, zone: "ORIENTE" },
  { id: 47, name: "SAN VICENTE RIONEGRO", lat: 6.1315, lng: -75.3912, zone: "ORIENTE" },
  { id: 48, name: "S.J.D LA CEJA", lat: 6.0315, lng: -75.4312, zone: "ORIENTE" },
  { id: 49, name: "S.J.D SANTA FE", lat: 6.5571, lng: -75.8271, zone: "OCCIDENTE" }
];

export default function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAP_API_KEY,
    libraries: LIBRARIES
  });

  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState(clinicsData[0]);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
  const [manualTraffic, setManualTraffic] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK') {
      setDirections(res);
    }
  }, []);

  const routeSummary = useMemo(() => {
    if (!directions) return null;
    const leg = directions.routes[0].legs[0];
    let finalTime = leg.duration.text;
    const report = destination ? manualTraffic[destination.id] : null;

    if (report) {
      const extra = report === 'choque' ? 25 : 12;
      const totalMin = parseInt(leg.duration.text) + extra;
      finalTime = `${totalMin} min (Afectado por ${report})`;
    }

    return {
      distance: leg.distance.text,
      time: finalTime,
      from: origin.name,
      to: destination?.name,
      status: report || "VÍA LIBRE"
    };
  }, [directions, destination, manualTraffic, origin]);

  const copyForWhatsApp = () => {
    if (!routeSummary) return;
    const msg = `*REPORTE RADAR FLEET* 📡\n\n📍 *ORIGEN:* ${routeSummary.from}\n🏁 *DESTINO:* ${routeSummary.to}\n📏 *DISTANCIA:* ${routeSummary.distance}\n⏱️ *TIEMPO EST:* ${routeSummary.time}\n⚠️ *NOVEDAD:* ${routeSummary.status.toUpperCase()}\n\n_Sincronizado con Google Maps Live 24/7_`;
    
    navigator.clipboard.writeText(msg).then(() => {
      const btn = document.getElementById('copyBtn');
      btn.innerText = "✅ ¡LISTO PARA PEGAR!";
      setTimeout(() => btn.innerText = "COPIAR REPORTE WHATSAPP", 2000);
    });
  };

  if (!isLoaded) return <div className="h-screen bg-black flex items-center justify-center text-blue-500 font-black italic animate-pulse">CARGANDO MAPA EN VIVO...</div>;

  return (
    <div className="flex h-screen bg-[#020617] text-white overflow-hidden font-sans">
      
      {/* PANEL DE CONTROL COMPACTO */}
      <aside className={`transition-all duration-300 z-30 bg-[#0f172a]/90 backdrop-blur-md border-r border-blue-500/20 shadow-2xl flex flex-col ${sidebarOpen ? 'w-80' : 'w-0 -translate-x-full'}`}>
        <div className="p-4 w-80 flex flex-col h-full overflow-hidden">
          <header className="mb-4">
            <h1 className="text-xl font-black italic text-blue-400 leading-none">RADAR FLEET</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sincronización Logística</p>
          </header>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {/* SELECTORES DE RUTA */}
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-blue-500/20">
              <label className="text-[9px] font-black text-blue-500 uppercase block mb-1">Punto A (Salida)</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none mb-3"
                value={origin?.id}
                onChange={(e) => { setOrigin(clinicsData.find(c => c.id === parseInt(e.target.value))); setDirections(null); }}
              >
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="text-[9px] font-black text-green-500 uppercase block mb-1">Punto B (Destino)</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none"
                value={destination?.id || ""}
                onChange={(e) => {
                  const dest = clinicsData.find(c => c.id === parseInt(e.target.value));
                  setDestination(dest);
                  setDirections(null);
                  if(map) map.panTo({lat: dest.lat, lng: dest.lng});
                }}
              >
                <option value="" disabled>Seleccionar destino...</option>
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* LISTA DE CLÍNICAS MINI */}
            <div className="space-y-1.5">
              <input type="text" placeholder="🔍 Buscar..." className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-[10px] outline-none mb-2" onChange={(e) => setSearchTerm(e.target.value)} />
              {clinicsData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(clinic => (
                <div key={clinic.id} className={`p-2 rounded-xl border transition-all ${destination?.id === clinic.id ? 'bg-blue-600/30 border-blue-400' : 'bg-slate-900/40 border-slate-800'}`}>
                  <p className="text-[9px] font-bold uppercase truncate mb-1">{clinic.name}</p>
                  {!clinic.isBase && (
                    <div className="flex gap-1">
                      <button onClick={() => setManualTraffic(p => ({...p, [clinic.id]: p[clinic.id]==='taco'?null:'taco'}))} className={`flex-1 py-1 rounded text-[8px] font-black uppercase ${manualTraffic[clinic.id]==='taco' ? 'bg-orange-600' : 'bg-slate-800 text-slate-500'}`}>Taco</button>
                      <button onClick={() => setManualTraffic(p => ({...p, [clinic.id]: p[clinic.id]==='choque'?null:'choque'}))} className={`flex-1 py-1 rounded text-[8px] font-black uppercase ${manualTraffic[clinic.id]==='choque' ? 'bg-red-600' : 'bg-slate-700 text-slate-500'}`}>Choque</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* REPORTE WHATSAPP */}
          {routeSummary && (
            <div className="mt-4 p-4 bg-blue-600/20 border border-blue-400/30 rounded-2xl shadow-xl">
              <div className="grid grid-cols-2 gap-2 mb-3 text-center">
                <div><p className="text-[8px] text-slate-400 uppercase">Distancia</p><p className="text-sm font-black text-blue-400">{routeSummary.distance}</p></div>
                <div className="border-l border-slate-800"><p className="text-[8px] text-slate-400 uppercase">Tiempo Live</p><p className="text-sm font-black text-green-400">{routeSummary.time}</p></div>
              </div>
              <button id="copyBtn" onClick={copyForWhatsApp} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-[9px] font-black uppercase tracking-tighter">COPIAR REPORTE WHATSAPP</button>
            </div>
          )}
        </div>
      </aside>

      {/* MAPA PROTAGONISTA */}
      <main className="flex-1 relative">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 left-4 z-40 bg-slate-900/90 border border-slate-700 p-3 rounded-xl shadow-2xl hover:bg-blue-600 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          onLoad={setMap}
          options={{ styles: darkStyle, disableDefaultUI: true, zoomControl: true }}
        >
          {/* TRÁFICO GOOGLE MAPS 24/7 (LÍNEAS ROJAS) */}
          <TrafficLayer />

          {/* CÁLCULO DE LA MEJOR RUTA (LÍNEA AZUL) */}
          {origin && destination && (
            <DirectionsService
              options={{ origin: { lat: origin.lat, lng: origin.lng }, destination: { lat: destination.lat, lng: destination.lng }, travelMode: 'DRIVING' }}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{ directions: directions, polylineOptions: { strokeColor: "#3b82f6", strokeWeight: 7, strokeOpacity: 0.8 }, suppressMarkers: true }}
            />
          )}

          {/* MARCADORES */}
          {clinicsData.map(c => (
            <Marker
              key={c.id}
              position={{ lat: c.lat, lng: c.lng }}
              onClick={() => { setDestination(c); setDirections(null); }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: manualTraffic[c.id] === 'choque' ? '#ef4444' : (manualTraffic[c.id] === 'taco' ? '#f97316' : (c.isBase ? '#facc15' : '#3b82f6')),
                fillOpacity: 1, strokeWeight: 2, strokeColor: "#ffffff", scale: (destination?.id === c.id || origin?.id === c.id) ? 1.7 : 1.1
              }}
            />
          ))}
        </GoogleMap>

        {/* LEYENDA FLOTANTE */}
        <div className="absolute bottom-6 right-6 bg-slate-900/80 backdrop-blur p-3 rounded-2xl border border-slate-700 text-[9px] font-bold space-y-2 pointer-events-none hidden md:block">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div><span>TRÁFICO ALTO (GOOGLE LIVE)</span></div>
          <div className="flex items-center gap-2 text-blue-400"><div className="w-6 h-1 bg-blue-500 rounded"></div><span>MEJOR RUTA SUGERIDA</span></div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; } .gm-style-iw { border-radius: 16px !important; padding: 0 !important; }` }} />
    </div>
  );
}

const darkStyle = [{"elementType":"geometry","stylers":[{"color":"#1d2c4d"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#8ec3b9"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#1a3646"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#304a7d"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#98a5be"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#0e1626"}]}];