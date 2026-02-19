'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weatherCurrent, setWeatherCurrent] = useState(null);
  const [weatherDaily, setWeatherDaily] = useState([]);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState(null);
  const weatherApiKey = process.env.NEXT_PUBLIC_WEATHERAPI_KEY;

  const carouselImages = [
    {
      url: "/marcelo.png",
      titulo: "Bienvenidos a Canal Udol",
      subtitulo: "Tu conexión directa con la actualidad y el entretenimiento"
    },
    {
      url: "/maribel.png",
      titulo: "Información Veraz",
      subtitulo: "Periodismo de investigación con compromiso y rigor"
    },
    {
      url: "/maritza2.jpg",
      titulo: "Creciendo Juntos",
      subtitulo: "Un espacio pensado para la comunidad y el desarrollo"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Usa solo Open-Meteo
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=-39.285&longitude=-72.227&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto';
        const res = await fetch(url);
        const data = await res.json();

        setWeatherCurrent(data.current_weather || null);

        const daily = data.daily?.time?.map((t, i) => ({
          time: t,
          tmax: data.daily.temperature_2m_max[i],
          tmin: data.daily.temperature_2m_min[i],
          code: data.daily.weathercode?.[i] ?? 3,
          icon: null,
        })) || [];

        setWeatherDaily(daily);
      } catch (e) {
        setWeatherError('No se pudo cargar el clima');
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  const formatDay = (iso) => {
    const d = new Date(iso);
    const wd = d.toLocaleDateString('es-CL', { weekday: 'short' }).replace('.', '');
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${wd} ${dd}/${mm}`;
  };

  const getWeatherIcon = (code) => {
    if (code === undefined || code === null) return '🌤️';
    if (code === 0) return '☀️'; // Despejado
    if ([1, 2].includes(code)) return '🌤️'; // Mayormente despejado / Parcialmente nublado
    if (code === 3) return '☁️'; // Nublado
    if ([45, 48].includes(code)) return '🌫️'; // Niebla
    if ([51, 53, 55].includes(code)) return '🌦️'; // Llovizna
    if ([56, 57].includes(code)) return '🌧️'; // Llovizna helada
    if ([61, 63, 65].includes(code)) return '🌧️'; // Lluvia
    if ([66, 67].includes(code)) return '🌧️'; // Lluvia helada
    if ([71, 73, 75, 77].includes(code)) return '🌨️'; // Nieve
    if ([80, 81, 82].includes(code)) return '🌦️'; // Chubascos
    if ([85, 86].includes(code)) return '🌨️'; // Chubascos de nieve
    if ([95, 96, 99].includes(code)) return '⛈️'; // Tormenta
    return '☁️';
  };

  const getWeatherBg = ({ waCode = null, waText = null, omCode = null }) => {
    // WeatherAPI condition code mapping (parcialmente nublado 1003, nublado 1006, cubierto 1009, soleado 1000, niebla 1030, lluvia 1180..1201, tormenta 1273..1282, nieve 1210..1237)
    const byWeatherAPI = (c) => {
      if (c === 1000) return '/weather/clear.jpg';
      if ([1003].includes(c)) return '/weather/partly-cloudy.jpg';
      if ([1006, 1009].includes(c)) return '/weather/cloudy.jpg';
      if (c === 1030) return '/weather/fog.jpg';
      if ((c >= 1180 && c <= 1201) || c === 1063) return '/weather/rain.jpg';
      if ((c >= 1210 && c <= 1237)) return '/weather/snow.jpg';
      if ((c >= 1273 && c <= 1282)) return '/weather/thunder.jpg';
      return '/weather/cloudy.jpg';
    };
    // Open-Meteo weathercode mapping
    const byOpenMeteo = (c) => {
      if (c === 0) return '/weather/clear.jpg';
      if ([1, 2].includes(c)) return '/weather/partly-cloudy.jpg';
      if (c === 3) return '/weather/cloudy.jpg';
      if ([45, 48].includes(c)) return '/weather/fog.jpg';
      if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(c)) return '/weather/rain.jpg';
      if ([71, 73, 75, 77, 85, 86].includes(c)) return '/weather/snow.jpg';
      if ([95, 96, 99].includes(c)) return '/weather/thunder.jpg';
      return '/weather/cloudy.jpg';
    };
    // Preferencia por texto si dice "parcial"
    if (waText && (/parcial/i.test(waText) || /partly/i.test(waText))) return '/weather/partly-cloudy.jpg';
    if (waCode !== null && waCode !== undefined) return byWeatherAPI(waCode);
    if (omCode !== null && omCode !== undefined) return byOpenMeteo(omCode);
    return null;
  };

  const getCodeFromIcon = (iconUrl) => {
    if (!iconUrl) return null;
    // El ícono tiene formato: https://cdn.weatherapi.com/weather/64x64/night/113.png
    // Extraemos el número (113, 116, etc)
    const match = iconUrl.match(/\/(\d+)\.png$/);
    return match ? parseInt(match[1]) : null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Clima antes del carrusel */}
      <section
        className="relative py-6"
        style={{
          backgroundImage: "url('/volcan1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-black/35"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div
            className="relative rounded-2xl overflow-hidden p-6 md:p-8 shadow"
            style={{
              backgroundImage: (() => {
                const currentCode = weatherCurrent?.weathercode ?? weatherDaily?.[0]?.code ?? null;

                const getWeatherImage = (code) => {
                  if (code === 0) return '/weather/clear.jpg';
                  if ([1, 2].includes(code)) return '/weather/partly-cloudy.jpg';
                  if (code === 3) return '/weather/cloudy.jpg';
                  if ([45, 48].includes(code)) return '/weather/fog.jpg';
                  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return '/weather/rain.jpg';
                  if ([71, 73, 75, 77, 85, 86].includes(code)) return '/weather/snow.jpg';
                  if ([95, 96, 99].includes(code)) return '/weather/thunder.jpg';
                  return '/weather/cloudy.jpg';
                };

                const bg = getWeatherImage(currentCode);
                return bg ? `url(${bg})` : undefined;
              })(),
              backgroundSize: '110%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundColor: '#eff6ff',
            }}
          >
            {/* Overlay más suave y con degradado */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-transparent pointer-events-none"></div>

            <div className="relative">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4 drop-shadow-lg">
                Clima en Villarrica
              </h2>
              {weatherLoading ? (
                <p className="text-white drop-shadow">Cargando clima...</p>
              ) : weatherError ? (
                <p className="text-red-100 drop-shadow">{weatherError}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    {weatherCurrent?.icon ? (
                      <img src={weatherCurrent.icon} alt="Clima actual" className="h-20 w-20 md:h-24 md:w-24 object-contain drop-shadow-2xl" />
                    ) : (
                      <span className="text-5xl md:text-6xl drop-shadow-lg">{getWeatherIcon(weatherCurrent?.weathercode)}</span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl">
                        {Math.round((weatherCurrent?.temperature ?? weatherCurrent?.temp_c ?? 0))}°
                      </span>
                      <span className="text-white drop-shadow-lg">Hoy</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                      {weatherDaily.slice(1, 6).map((d) => (
                        <div key={d.time} className="bg-white/95 backdrop-blur-sm rounded-xl p-3 text-center shadow-lg">
                          <div className="text-xs text-gray-600 uppercase tracking-wide">{formatDay(d.time)}</div>
                          <div className="mt-1 h-10 flex items-center justify-center">
                            {d.icon ? (
                              <img src={d.icon} alt="Clima pronosticado" className="h-10 w-10 object-contain drop-shadow-sm" />
                            ) : (
                              <span className="text-2xl">{getWeatherIcon(d.code)}</span>
                            )}
                          </div>
                          <div className="text-blue-700 font-bold mt-1">
                            {Math.round(d.tmax)}° / {Math.round(d.tmin)}°
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Hero Carrusel de Texto */}
      <section className="relative h-80 sm:h-96 md:h-[450px] w-full overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        {carouselImages.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center text-white text-center p-6 ${idx === currentSlide
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
              }`}
          >
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
                {img.titulo}
              </h1>
              <div className="h-1.5 w-24 bg-blue-400 mx-auto mb-8 rounded-full"></div>
              <p className="text-xl md:text-3xl font-light tracking-wide leading-relaxed drop-shadow-md">
                {img.subtitulo}
              </p>
            </div>
          </div>
        ))}

        {/* Indicadores Minimalistas */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-6">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className="group relative py-4"
            >
              <span className={`block w-12 h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-white' : 'bg-white/30 group-hover:bg-white/50'
                }`} />
            </button>
          ))}
        </div>
      </section>

      {/* Contenido principal breve */}
      <main className="flex-grow bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Últimas Noticias</h3>
              <p className="text-black leading-relaxed">Mantente al día con los acontecimientos más relevantes de nuestra región y el mundo.</p>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow border-t-4 border-blue-600">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">En Vivo</h3>
              <p className="text-black leading-relaxed">No te pierdas nuestra señal en directo lunes, miercoles y viernes a las 8:30 con contenido exclusivo para ti.</p>
            </div>

            <div className="p-8 rounded-2xl bg-blue-50 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Nuestro Elenco</h3>
              <p className="text-black leading-relaxed">Conoce a las caras que acompañan tus tardes y mañanas en Canal Udol.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
