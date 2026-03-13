import React, { useState, useCallback, useMemo } from 'react';
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

const clinicsData = [
  { id: 0, name: "CE01 T.S (BASE)", lat: 6.2308, lng: -75.5905, zone: "CENTRAL" },
  { id: 1, name: "SAN VICENTE - CALDAS", lat: 6.0911, lng: -75.6358, zone: "SUR ALTO" },
  { id: 2, name: "ANTIOQUIA ITAGÜÍ", lat: 6.1725, lng: -75.6095, zone: "SUR ALTO" },
  { id: 3, name: "SAN RAFAEL ITAGÜÍ", lat: 6.1712, lng: -75.6052, zone: "SUR ALTO" },
  { id: 4, name: "NEUROMÉDICA MAYORCA", lat: 6.1601, lng: -75.6051, zone: "SUR ALTO" },
  { id: 7, name: "CLÍNICA LAS VEGAS", lat: 6.2016, lng: -75.5774, zone: "SUR ALTO" },
  { id: 12, name: "CLÍNICA NOEL", lat: 6.2345, lng: -75.5721, zone: "SUR BAJO" },
  { id: 14, name: "MEDELLÍN POBLADO", lat: 6.2001, lng: -75.5661, zone: "SUR BAJO" },
  { id: 16, name: "ROSARIO TESORO", lat: 6.1985, lng: -75.5485, zone: "SUR BAJO" },
  { id: 19, name: "LAS AMÉRICAS", lat: 6.2215, lng: -75.5942, zone: "SUR BAJO" },
  { id: 27, name: "CLÍNICA SOMA", lat: 6.2455, lng: -75.5641, zone: "CENTRO" },
  { id: 29, name: "ROSARIO CENTRO", lat: 6.2482, lng: -75.5615, zone: "CENTRO" },
  { id: 30, name: "SAN VICENTE MEDELLÍN", lat: 6.2625, lng: -75.5655, zone: "CENTRO" },
  { id: 38, name: "PABLO TOBÓN URIBE", lat: 6.2735, lng: -75.5788, zone: "NORTE" },
  { id: 40, name: "ANTIOQUIA BELLO", lat: 6.3312, lng: -75.5574, zone: "NORTE" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const directionsCallback = useCallback((res) => {
    if (res !== null && res.status === 'OK') {
      setDirections(res);
    }
  }, []);

  // Resumen de la ruta con TIEMPO DE TRÁFICO REAL
  const routeSummary = useMemo(() => {
    if (!directions) return null;
    const leg = directions.routes[0].legs[0];
    
    // Google devuelve 'duration' (normal) y 'duration_in_traffic' (si está disponible)
    const timeWithTraffic = leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text;

    return {
      distance: leg.distance.text,
      time: timeWithTraffic,
      from: origin.name,
      to: destination?.name
    };
  }, [directions, destination, origin]);

  const copyForWhatsApp = () => {
    if (!routeSummary) return;
    const msg = `*REPORTE FLEET RADAR* 📡\n\n📍 *ORIGEN:* ${routeSummary.from}\n🏁 *DESTINO:* ${routeSummary.to}\n📏 *DISTANCIA:* ${routeSummary.distance}\n⏱️ *TIEMPO (CON TRÁFICO):* ${routeSummary.time}\n\n_Datos en tiempo real de Google Maps_`;
    
    const el = document.createElement('textarea');
    el.value = msg;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    const btn = document.getElementById('copyBtn');
    btn.innerText = "✅ ¡COPIADO PARA WHATSAPP!";
    setTimeout(() => btn.innerText = "COPIAR REPORTE", 2000);
  };

  if (!isLoaded) return <div className="h-screen bg-[#020617] flex items-center justify-center text-blue-400 font-black italic animate-pulse">SINCRONIZANDO TRÁFICO...</div>;

  const filteredClinics = clinicsData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR COMPACTO */}
      <aside className={`transition-all duration-300 z-30 bg-[#0f172a]/95 backdrop-blur-md border-r border-blue-500/20 shadow-2xl flex flex-col ${sidebarOpen ? 'w-72' : 'w-0 -translate-x-full'}`}>
        <div className="p-4 w-72 flex flex-col h-full overflow-hidden">
          <header className="mb-4">
            <h1 className="text-xl font-black italic text-blue-400 tracking-tighter">FLEET RADAR</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Sincronización 24/7</p>
          </header>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 custom-scrollbar">
            {/* SELECTORES DE RUTA */}
            <div className="bg-slate-900/80 p-3 rounded-2xl border border-blue-500/20">
              <label className="text-[9px] font-black text-blue-400 uppercase">Salida</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none mt-1 mb-3"
                value={origin?.id}
                onChange={(e) => { 
                  const org = clinicsData.find(c => c.id === parseInt(e.target.value));
                  setOrigin(org); 
                  setDirections(null); 
                  if(map) map.panTo({lat: org.lat, lng: org.lng});
                }}
              >
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="text-[9px] font-black text-green-400 uppercase block">Llegada</label>
              <select className="w-full bg-[#1e293b] border-none rounded-lg p-2 text-xs outline-none mt-1"
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

            {/* LISTA DE CLÍNICAS (SIN BOTONES DE TACO) */}
            <div className="space-y-1.5">
              <input 
                type="text"
                placeholder="🔍 Filtrar clínicas..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-[10px] outline-none"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {filteredClinics.map(clinic => (
                <button
                  key={clinic.id}
                  onClick={() => {
                    setDestination(clinic);
                    setDirections(null);
                    if(map) map.panTo({lat: clinic.lat, lng: clinic.lng});
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    destination?.id === clinic.id ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-slate-900/40 border-slate-800 hover:border-blue-700'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase truncate">{clinic.name}</p>
                  <p className="text-[7px] text-slate-500 font-black uppercase tracking-widest">{clinic.zone}</p>
                </button>
              ))}
            </div>
          </div>

          {/* RECUADRO DE REPORTE */}
          {routeSummary && (
            <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl animate-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-[8px] text-slate-400 uppercase">Distancia</p>
                  <p className="text-sm font-black text-blue-400">{routeSummary.distance}</p>
                </div>
                <div className="text-center border-l border-slate-700">
                  <p className="text-[8px] text-slate-400 uppercase">Tiempo con Tráfico</p>
                  <p className="text-sm font-black text-green-400">{routeSummary.time}</p>
                </div>
              </div>
              <button 
                id="copyBtn"
                onClick={copyToWhatsApp}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all"
              >
                COPIAR REPORTE
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAPA PRINCIPAL */}
      <main className="flex-1 relative h-full">
        {/* BOTÓN MENU */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-40 bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-2xl"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={center}
          zoom={12}
          onLoad={setMap}
          options={{ styles: darkMapStyle, disableDefaultUI: true, zoomControl: true }}
        >
          {/* TRÁFICO EN VIVO (LÍNEAS ROJAS) */}
          <TrafficLayer />

          {/* CÁLCULO DE LA MEJOR RUTA CON TRÁFICO */}
          {origin && destination && (
            <DirectionsService
              options={{
                origin: { lat: origin.lat, lng: origin.lng },
                destination: { lat: destination.lat, lng: destination.lng },
                travelMode: 'DRIVING',
                drivingOptions: {
                  departureTime: new Date(), // ESTO ACTIVA EL TRÁFICO REAL
                  trafficModel: 'bestguess'
                }
              }}
              callback={directionsCallback}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
                polylineOptions: {
                  strokeColor: "#3b82f6",
                  strokeWeight: 7,
                  strokeOpacity: 0.8
                },
                suppressMarkers: true
              }}
            />
          )}

          {/* MARCADORES CON NOMBRES */}
          {clinicsData.map(c => (
            <Marker
              key={c.id}
              position={{ lat: c.lat, lng: c.lng }}
              label={{
                text: c.name,
                color: "white",
                fontSize: "8px",
                fontWeight: "bold",
                className: "marker-label"
              }}
              onClick={() => {
                setDestination(c);
                setDirections(null);
                if(map) map.panTo({lat: c.lat, lng: c.lng});
              }}
              icon={{
                path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                fillColor: c.id === 0 ? "#facc15" : (destination?.id === c.id ? "#60a5fa" : "#3b82f6"),
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
                scale: (destination?.id === c.id || origin?.id === c.id) ? 1.5 : 1.1,
                labelOrigin: { x: 12, y: -10 } // Pone el nombre arriba del pin
              }}
            />
          ))}
        </GoogleMap>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3b82f6; border-radius: 10px; }
        .marker-label { background: rgba(15, 23, 42, 0.8); padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(59, 130, 246, 0.5); }
      `}} />
    </div>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];