import React, { useState, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const MAP_API_KEY = ""; // La API Key se inyecta automáticamente

const center = { lat: 6.23, lng: -75.50 };

const clinicsData = [
  { id: 0, name: "CE01 T.S", lat: 6.2308, lng: -75.5905, zone: "CENTRAL" },
  // SUR ALTO
  { id: 1, name: "HOSPITAL SAN VICENTE DE PAUL - CALDAS", lat: 6.0911, lng: -75.6358, zone: "SUR ALTO" },
  { id: 2, name: "CLINICA ANTIOQUIA ITAGUI", lat: 6.1725, lng: -75.6095, zone: "SUR ALTO" },
  { id: 3, name: "HOSPITAL SAN RAFAEL ITAGUI", lat: 6.1712, lng: -75.6052, zone: "SUR ALTO" },
  { id: 4, name: "NEUROMEDICA - MAYORCA", lat: 6.1601, lng: -75.6051, zone: "SUR ALTO" },
  { id: 5, name: "CLINICA DE LA POLICIA", lat: 6.2023, lng: -75.5772, zone: "SUR ALTO" },
  { id: 6, name: "CLINICA EL CAMPESTRE", lat: 6.2014, lng: -75.5681, zone: "SUR ALTO" },
  { id: 7, name: "CLINICA LAS VEGAS", lat: 6.2016, lng: -75.5774, zone: "SUR ALTO" },
  { id: 8, name: "HOSPITAL VENANCIO DIAZ", lat: 6.1517, lng: -75.6174, zone: "SUR ALTO" },
  { id: 9, name: "MANUEL URIBE ANGEL", lat: 6.1691, lng: -75.5843, zone: "SUR ALTO" },
  { id: 10, name: "SAMPEDRO ESTRELLA", lat: 6.1555, lng: -75.6433, zone: "SUR ALTO" },
  { id: 11, name: "STERIL", lat: 6.1550, lng: -75.6100, zone: "SUR ALTO" },
  // SUR BAJO
  { id: 12, name: "CLINICA NOEL", lat: 6.2345, lng: -75.5721, zone: "SUR BAJO" },
  { id: 13, name: "FRACTURAS POBLADO", lat: 6.2081, lng: -75.5672, zone: "SUR BAJO" },
  { id: 14, name: "CLINICA MEDELLIN SEDE POBLADO", lat: 6.2001, lng: -75.5661, zone: "SUR BAJO" },
  { id: 15, name: "INTERQUIROFANOS", lat: 6.2005, lng: -75.5665, zone: "SUR BAJO" },
  { id: 16, name: "CLINICA ROSARIO TESORO", lat: 6.1985, lng: -75.5485, zone: "SUR BAJO" },
  { id: 17, name: "CENTRO ORTOPEDIA EL POBLADO", lat: 6.2100, lng: -75.5650, zone: "SUR BAJO" },
  { id: 18, name: "METROSALUD", lat: 6.2150, lng: -75.5750, zone: "SUR BAJO" },
  { id: 19, name: "CLINICA LAS AMERICAS", lat: 6.2215, lng: -75.5942, zone: "SUR BAJO" },
  { id: 20, name: "CLINICA MEDELLIN SEDE OCCIDENTE", lat: 6.2405, lng: -75.5895, zone: "SUR BAJO" },
  { id: 21, name: "INTITUTO COLOMBIANO DEL DOLOR", lat: 6.2410, lng: -75.5710, zone: "SUR BAJO" },
  { id: 22, name: "HOSPITAL GENERAL DE MEDELLIN", lat: 6.2371, lng: -75.5694, zone: "SUR BAJO" },
  { id: 23, name: "CENTRO ORTOPEDIA EL ESTADIO", lat: 6.2480, lng: -75.5850, zone: "SUR BAJO" },
  { id: 24, name: "CORPAUL", lat: 6.2250, lng: -75.5800, zone: "SUR BAJO" },
  { id: 25, name: "COOPSANA", lat: 6.2450, lng: -75.5750, zone: "SUR BAJO" },
  // CENTRO
  { id: 26, name: "CLINICA CENTRAL FUNDADORES", lat: 6.2423, lng: -75.5647, zone: "CENTRO" },
  { id: 27, name: "CLINICA SOMA", lat: 6.2455, lng: -75.5641, zone: "CENTRO" },
  { id: 28, name: "CLINICA SAGRADO CORAZON", lat: 6.2422, lng: -75.5563, zone: "CENTRO" },
  { id: 29, name: "CLINICA ROSARIO CENTRO", lat: 6.2482, lng: -75.5615, zone: "CENTRO" },
  { id: 30, name: "FUNDACION SAN VICENTE DE PAUL MEDELLIN", lat: 6.2625, lng: -75.5655, zone: "CENTRO" },
  { id: 31, name: "CLINICA LEON XIII-AUDIFARMA", lat: 6.2612, lng: -75.5638, zone: "CENTRO" },
  { id: 32, name: "CONSEJO DE MEDELLIN", lat: 6.2425, lng: -75.5891, zone: "CENTRO" },
  { id: 33, name: "CLINICA CES", lat: 6.2435, lng: -75.5661, zone: "CENTRO" },
  { id: 34, name: "CLINICA VIDA", lat: 6.2185, lng: -75.5685, zone: "CENTRO" },
  { id: 35, name: "INSTITUTO NEUROLOGICO", lat: 6.2618, lng: -75.5635, zone: "CENTRO" },
  { id: 36, name: "IPS PRADO", lat: 6.2571, lng: -75.5612, zone: "CENTRO" },
  // NORTE
  { id: 37, name: "CLINICA BOLIVARIANA", lat: 6.2731, lng: -75.5781, zone: "NORTE" },
  { id: 38, name: "HOSPITAL PABLO TOBON", lat: 6.2735, lng: -75.5788, zone: "NORTE" },
  { id: 39, name: "HOSPITAL LA MARIA", lat: 6.2845, lng: -75.5791, zone: "NORTE" },
  { id: 40, name: "CLINICA ANTIOQUIA BELLO", lat: 6.3312, lng: -75.5574, zone: "NORTE" },
  { id: 41, name: "TERMINAL NORTE", lat: 6.2855, lng: -75.5715, zone: "NORTE" },
  { id: 42, name: "CLINICA NORTE", lat: 6.3351, lng: -75.5512, zone: "NORTE" },
  { id: 43, name: "IPS INTEGRADOS", lat: 6.3371, lng: -75.5532, zone: "NORTE" },
  // ORIENTE
  { id: 44, name: "HOSPITAL SAN JUAN DE DIOS RIONEGRO", lat: 6.1512, lng: -75.3735, zone: "ORIENTE" },
  { id: 45, name: "CLINICA SOMER", lat: 6.1425, lng: -75.3788, zone: "ORIENTE" },
  { id: 46, name: "NEUROMEDICA- RIONEGRO", lat: 6.1525, lng: -75.3745, zone: "ORIENTE" },
  { id: 47, name: "SAN VICENTE DE PAUL - RIONEGRO", lat: 6.1315, lng: -75.3912, zone: "ORIENTE" },
  { id: 48, name: "CLINICA SAN JUAN DE DIOS DE LA CEJA", lat: 6.0315, lng: -75.4312, zone: "ORIENTE" },
  // OCCIDENTE
  { id: 49, name: "HOSPITAL SAN JUAN DE DIOS - SANTA FE", lat: 6.5571, lng: -75.8271, zone: "OCCIDENTE" }
];

const containerStyle = { width: '100%', height: '100%' };

export default function App() {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: MAP_API_KEY });
  const [map, setMap] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleClinicClick = (clinic) => {
    setSelectedClinic(clinic);
    if (map) { map.panTo({ lat: clinic.lat, lng: clinic.lng }); map.setZoom(16); }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const filteredClinics = useMemo(() => {
    return clinicsData.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.zone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      <header className="p-3 bg-[#1e293b] shadow-xl flex justify-between items-center z-30 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-slate-700 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-blue-400 italic leading-none">RADAR FLEET</h1>
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-1">Sincronización Logística</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <aside className={`absolute md:relative z-20 h-full bg-[#0f172a] border-r border-blue-900/50 transition-all duration-300 ${sidebarOpen ? 'w-full md:w-80' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'}`}>
          <div className="p-4 flex flex-col h-full w-80">
            <input 
              type="text"
              placeholder="🔍 Buscar clínica o zona..."
              className="w-full bg-[#1e293b] border border-blue-900/50 rounded-xl py-3 px-4 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredClinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => handleClinicClick(clinic)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all border flex flex-col gap-0.5 ${
                    selectedClinic?.id === clinic.id 
                    ? 'bg-blue-600 border-blue-400 shadow-lg' 
                    : 'bg-[#1e293b]/40 border-slate-800 hover:border-blue-700'
                  } ${clinic.id === 0 ? 'border-yellow-500 border-2 shadow-lg shadow-yellow-900/20' : ''}`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-tight ${selectedClinic?.id === clinic.id ? 'text-white' : 'text-slate-200'}`}>
                    {clinic.name}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${selectedClinic?.id === clinic.id ? 'text-blue-200' : 'text-slate-500'}`}>
                    {clinic.zone}
                  </span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => { if(map) { map.panTo(center); map.setZoom(11); }}}
              className="mt-4 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              VISTA GENERAL
            </button>
          </div>
        </aside>

        <main className="flex-1 relative h-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={11}
              onLoad={setMap}
              options={{ styles: darkMapStyle, disableDefaultUI: false, zoomControl: true, mapTypeControl: false, streetViewControl: false }}
            >
              {clinicsData.map(clinic => (
                <Marker
                  key={clinic.id}
                  position={{ lat: clinic.lat, lng: clinic.lng }}
                  onClick={() => handleClinicClick(clinic)}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: clinic.id === 0 ? "#facc15" : (selectedClinic?.id === clinic.id ? "#60a5fa" : "#3b82f6"),
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                    scale: clinic.id === 0 ? 1.8 : 1.4,
                  }}
                />
              ))}

              {selectedClinic && (
                <InfoWindow position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }} onCloseClick={() => setSelectedClinic(null)}>
                  <div className="text-slate-900 p-2 min-w-[150px]">
                    <h3 className="font-black text-[10px] border-b border-slate-200 pb-1 mb-2 uppercase text-blue-700">{selectedClinic.name}</h3>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic.lat},${selectedClinic.lng}`}
                      target="_blank" rel="noreferrer"
                      className="block w-full text-center py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter"
                    >
                      TRAZAR RUTA
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#0f172a]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-500"></div>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .gm-style-iw { border-radius: 12px !important; padding: 0 !important; }
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