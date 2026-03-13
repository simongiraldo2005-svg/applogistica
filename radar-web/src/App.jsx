import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { 
  GoogleMap, 
  useJsApiLoader, 
  Marker, 
  TrafficLayer, 
  DirectionsService, 
  DirectionsRenderer 
} from '@react-google-maps/api';

// --- CONFIGURACIÓN OFICIAL ---
const MAP_API_KEY = "AIzaSyD8Fk1A0TjWai8vnLE0xGberUtEhVGIW-U"; 
const LIBRARIES = ["geometry", "places"];

const center = { lat: 6.2442, lng: -75.5812 };

// LISTADO COMPLETO DE LAS 49 CLÍNICAS DEL EXCEL
const clinicsData = [
  { id: 0, name: "CE01 T.S (BASE)", lat: 6.2308, lng: -75.5905, zone: "CENTRAL" },
  // SUR ALTO (11)
  { id: 1, name: "HOSP. S.V.P CALDAS", lat: 6.0911, lng: -75.6358, zone: "SUR ALTO" },
  { id: 2, name: "CLINICA ANTIOQUIA ITAGUI", lat: 6.1725, lng: -75.6095, zone: "SUR ALTO" },
  { id: 3, name: "HOSP. SAN RAFAEL ITAGUI", lat: 6.1712, lng: -75.6052, zone: "SUR ALTO" },
  { id: 4, name: "NEUROMEDICA MAYORCA", lat: 6.1601, lng: -75.6051, zone: "SUR ALTO" },
  { id: 5, name: "CLINICA DE LA POLICIA", lat: 6.2023, lng: -75.5772, zone: "SUR ALTO" },
  { id: 6, name: "CLINICA EL CAMPESTRE", lat: 6.2014, lng: -75.5681, zone: "SUR ALTO" },
  { id: 7, name: "CLINICA LAS VEGAS", lat: 6.2016, lng: -75.5774, zone: "SUR ALTO" },
  { id: 8, name: "HOSP. VENANCIO DIAZ", lat: 6.1517, lng: -75.6174, zone: "SUR ALTO" },
  { id: 9, name: "MANUEL URIBE ANGEL", lat: 6.1691, lng: -75.5843, zone: "SUR ALTO" },
  { id: 10, name: "SAMPEDRO ESTRELLA", lat: 6.1555, lng: -75.6433, zone: "SUR ALTO" },
  { id: 11, name: "STERIL", lat: 6.1550, lng: -75.6100, zone: "SUR ALTO" },
  // SUR BAJO (14)
  { id: 12, name: "CLINICA NOEL", lat: 6.2345, lng: -75.5721, zone: "SUR BAJO" },
  { id: 13, name: "FRACTURAS POBLADO", lat: 6.2081, lng: -75.5672, zone: "SUR BAJO" },
  { id: 14, name: "CLINICA MEDELLIN POBLADO", lat: 6.2001, lng: -75.5661, zone: "SUR BAJO" },
  { id: 15, name: "INTERQUIROFANOS", lat: 6.2005, lng: -75.5665, zone: "SUR BAJO" },
  { id: 16, name: "ROSARIO TESORO", lat: 6.1985, lng: -75.5485, zone: "SUR BAJO" },
  { id: 17, name: "CENTRO ORTOPEDIA POBLADO", lat: 6.2100, lng: -75.5650, zone: "SUR BAJO" },
  { id: 18, name: "METROSALUD", lat: 6.2150, lng: -75.5750, zone: "SUR BAJO" },
  { id: 19, name: "CLINICA LAS AMERICAS", lat: 6.2215, lng: -75.5942, zone: "SUR BAJO" },
  { id: 20, name: "CLINICA MEDELLIN OCCIDENTE", lat: 6.2405, lng: -75.5895, zone: "SUR BAJO" },
  { id: 21, name: "INST. COLOMBIANO DEL DOLOR", lat: 6.2410, lng: -75.5710, zone: "SUR BAJO" },
  { id: 22, name: "HOSP. GENERAL DE MEDELLIN", lat: 6.2371, lng: -75.5694, zone: "SUR BAJO" },
  { id: 23, name: "ORTOPEDIA EL ESTADIO", lat: 6.2480, lng: -75.5850, zone: "SUR BAJO" },
  { id: 24, name: "CORPAUL", lat: 6.2250, lng: -75.5800, zone: "SUR BAJO" },
  { id: 25, name: "COOPSANA", lat: 6.2450, lng: -75.5750, zone: "SUR BAJO" },
  // CENTRO (11)
  { id: 26, name: "CLINICA CENTRAL FUNDADORES", lat: 6.2423, lng: -75.5647, zone: "CENTRO" },
  { id: 27, name: "CLINICA SOMA", lat: 6.2455, lng: -75.5641, zone: "CENTRO" },
  { id: 28, name: "CLINICA SAGRADO CORAZON", lat: 6.2422, lng: -75.5563, zone: "CENTRO" },
  { id: 29, name: "CLINICA ROSARIO CENTRO", lat: 6.2482, lng: -75.5615, zone: "CENTRO" },
  { id: 30, name: "FUNDACION SAN VICENTE MED", lat: 6.2625, lng: -75.5655, zone: "CENTRO" },
  { id: 31, name: "CLINICA LEON XIII", lat: 6.2612, lng: -75.5638, zone: "CENTRO" },
  { id: 32, name: "CONSEJO DE MEDELLIN", lat: 6.2425, lng: -75.5891, zone: "CENTRO" },
  { id: 33, name: "CLINICA CES", lat: 6.2435, lng: -75.5661, zone: "CENTRO" },
  { id: 34, name: "CLINICA VIDA", lat: 6.2185, lng: -75.5685, zone: "CENTRO" },
  { id: 35, name: "INSTITUTO NEUROLOGICO", lat: 6.2618, lng: -75.5635, zone: "CENTRO" },
  { id: 36, name: "IPS PRADO", lat: 6.2571, lng: -75.5612, zone: "CENTRO" },
  // NORTE (7)
  { id: 37, name: "CLINICA BOLIVARIANA", lat: 6.2731, lng: -75.5781, zone: "NORTE" },
  { id: 38, name: "HOSPITAL PABLO TOBON URIBE", lat: 6.2735, lng: -75.5788, zone: "NORTE" },
  { id: 39, name: "HOSPITAL LA MARIA", lat: 6.2845, lng: -75.5791, zone: "NORTE" },
  { id: 40, name: "CLINICA ANTIOQUIA BELLO", lat: 6.3312, lng: -75.5574, zone: "NORTE" },
  { id: 41, name: "TERMINAL NORTE", lat: 6.2855, lng: -75.5715, zone: "NORTE" },
  { id: 42, name: "CLINICA NORTE", lat: 6.3351, lng: -75.5512, zone: "NORTE" },
  { id: 43, name: "IPS INTEGRADOS", lat: 6.3371, lng: -75.5532, zone: "NORTE" },
  // ORIENTE (5)
  { id: 44, name: "HOSP. S.J.D RIONEGRO", lat: 6.1512, lng: -75.3735, zone: "ORIENTE" },
  { id: 45, name: "CLINICA SOMER", lat: 6.1425, lng: -75.3788, zone: "ORIENTE" },
  { id: 46, name: "NEUROMEDICA RIONEGRO", lat: 6.1525, lng: -75.3745, zone: "ORIENTE" },
  { id: 47, name: "SAN VICENTE RIONEGRO", lat: 6.1315, lng: -75.3912, zone: "ORIENTE" },
  { id: 48, name: "CLINICA S.J.D LA CEJA", lat: 6.0315, lng: -75.4312, zone: "ORIENTE" },
  // OCCIDENTE (1)
  { id: 49, name: "HOSPITAL S.J.D SANTA FE", lat: 6.5571, lng: -75.8271, zone: "OCCIDENTE" }
];

export default function App() {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: MAP_API_KEY, libraries: LIBRARIES });

  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState(clinicsData[0]);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState(null);
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
    const durationBase = leg.duration.value;
    const durationTraffic = leg.duration_in_traffic ? leg.duration_in_traffic.value : durationBase;
    const delayMin = Math.max(0, Math.floor((durationTraffic - durationBase) / 60));

    return {
      distance: leg.distance.text,
      timeBase: leg.duration.text,
      timeDelay: delayMin > 0 ? `+${delayMin} min de taco` : "Flujo Normal",
      timeTotal: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
      from: origin.name,
      to: destination?.name
    };
  }, [directions, origin, destination]);

  const copyForWhatsApp = () => {
    if (!routeSummary) return;
    const msg = `*REPORTE LOGÍSTICO FLEET* 📡\n\n📍 *ORIGEN:* ${routeSummary.from}\n🏁 *DESTINO:* ${routeSummary.to}\n📏 *DISTANCIA:* ${routeSummary.distance}\n⏱️ *TIEMPO BASE:* ${routeSummary.timeBase}\n🚦 *TIEMPO EN TACO:* ${routeSummary.timeDelay}\n🚀 *TIEMPO TOTAL:* ${routeSummary.timeTotal}\n\n_Sincronizado 24/7 con Google Maps Live_`;
    const el = document.createElement('textarea');
    el.value = msg; document.body.appendChild(el); el.select();
    document.execCommand('copy'); document.body.removeChild(el);
    const btn = document.getElementById('copyBtn');
    btn.innerText = "✅ COPIADO"; setTimeout(() => btn.innerText = "COPIAR REPORTE", 2000);
  };

  if (!isLoaded) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-500 font-black italic animate-pulse">CARGANDO RADAR FLEET...</div>;

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden">
      
      {/* SIDEBAR DE CONTROL */}
      <aside className={`transition-all duration-300 z-30 bg-[#0f172a]/95 backdrop-blur-md border-r border-blue-500/20 shadow-2xl flex flex-col ${sidebarOpen ? 'w-80' : 'w-0 -translate-x-full'}`}>
        <div className="p-4 w-80 flex flex-col h-full overflow-hidden">
          <header className="mb-4">
            <h1 className="text-2xl font-black italic text-blue-400 tracking-tighter">FLEET RADAR</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronización Logística Total</p>
          </header>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {/* SELECTORES DE RUTA */}
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-blue-500/20">
              <label className="text-[9px] font-black text-blue-400 uppercase">Punto de Salida</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none mt-1 mb-3"
                value={origin?.id}
                onChange={(e) => { 
                  const org = clinicsData.find(c => c.id === parseInt(e.target.value));
                  setOrigin(org); setDirections(null); 
                }}
              >
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="text-[9px] font-black text-green-400 uppercase block">Punto de Llegada</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none mt-1"
                value={destination?.id || ""}
                onChange={(e) => {
                  const dest = clinicsData.find(c => c.id === parseInt(e.target.value));
                  setDestination(dest); setDirections(null);
                  if(map) map.panTo({lat: dest.lat, lng: dest.lng});
                }}
              >
                <option value="" disabled>Seleccionar clínica...</option>
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* LISTA NAVEGABLE COMPACTA */}
            <div className="space-y-1">
              <input type="text" placeholder="🔍 Filtrar 49 clínicas..." className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-[10px] outline-none mb-2" onChange={(e) => setSearchTerm(e.target.value)} />
              {clinicsData.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(clinic => (
                <button
                  key={clinic.id}
                  onClick={() => {
                    setDestination(clinic); setDirections(null);
                    if(map) map.panTo({lat: clinic.lat, lng: clinic.lng});
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    destination?.id === clinic.id ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40' : 'bg-slate-900/40 border-slate-800 hover:border-blue-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase truncate">{clinic.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* PANEL DE RESULTADOS REALES */}
          {routeSummary && (
            <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl animate-in slide-in-from-bottom-2">
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-[10px] border-b border-white/5 pb-1">
                  <span className="text-slate-400 uppercase">Distancia:</span>
                  <span className="font-black text-blue-400">{routeSummary.distance}</span>
                </div>
                <div className="flex justify-between text-[10px] border-b border-white/5 pb-1">
                  <span className="text-slate-400 uppercase italic">Taco Estimado:</span>
                  <span className="font-black text-orange-400">{routeSummary.timeDelay}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black pt-1">
                  <span className="text-white uppercase">TIEMPO TOTAL:</span>
                  <span className="text-green-400">{routeSummary.timeTotal}</span>
                </div>
              </div>
              <button id="copyBtn" onClick={copyForWhatsApp} className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">COPIAR REPORTE</button>
            </div>
          )}
        </div>
      </aside>

      {/* MAPA PRINCIPAL */}
      <main className="flex-1 relative h-full">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="absolute top-4 left-4 z-40 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center} zoom={12} onLoad={setMap}
          options={{ styles: darkMapStyle, disableDefaultUI: true, zoomControl: true }}
        >
          <TrafficLayer />

          {origin && destination && !directions && (
            <DirectionsService
              options={{
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: 'DRIVING',
                drivingOptions: { departureTime: new Date(), trafficModel: 'bestguess' }
              }}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{ directions: directions, polylineOptions: { strokeColor: "#3b82f6", strokeWeight: 6, strokeOpacity: 0.8 }, suppressMarkers: true }}
            />
          )}

          {clinicsData.map(c => (
            <Marker
              key={c.id}
              position={{ lat: c.lat, lng: c.lng }}
              label={{
                text: c.name,
                color: "white", fontSize: "7px", fontWeight: "bold", className: "marker-label"
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: c.id === 0 ? "#facc15" : (destination?.id === c.id ? "#60a5fa" : "#3b82f6"),
                fillOpacity: 1, strokeWeight: 1, strokeColor: "#ffffff", scale: (destination?.id === c.id || origin?.id === c.id) ? 1.4 : 1.0,
                labelOrigin: { x: 12, y: -10 }
              }}
              onClick={() => { setDestination(c); setDirections(null); }}
            />
          ))}
        </GoogleMap>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .marker-label { background: rgba(15, 23, 42, 0.85); padding: 1px 4px; border-radius: 4px; pointer-events: none; text-shadow: 0 1px 2px black; border: 0.5px solid rgba(59, 130, 246, 0.4); }
      `}} />
    </div>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];