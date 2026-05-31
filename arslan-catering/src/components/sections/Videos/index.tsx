import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useSectionPage } from '../../../hooks/useSectionPage'
import { useLanguage, t } from '../../../hooks/useLanguage'
import SectionContainer from '../../SectionContainer'
import SectionHeader from '../../SectionHeader'
import Footer from '../../Footer'

interface Video {
  id: string
  titel: string
  titelTr?: string
  typ: 'youtube' | 'video'
  url: string
  datum?: string
  vorschau?: string
}

interface VideosData {
  titel?: string
  titelTr?: string
  beschreibung?: string
  beschreibungTr?: string
  videos?: Video[]
}

function getYoutubeId(url: string): string | null {
  const m =
    url.match(/[?&]v=([^&]+)/) ?? url.match(/youtu\.be\/([^?&]+)/) ?? url.match(/embed\/([^?&]+)/)
  return m?.[1] ?? null
}

function getYoutubeThumbnail(url: string): string | null {
  const id = getYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}

function getYoutubeEmbed(url: string): string | null {
  const id = getYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : null
}

export default function Videos() {
  const { ref, isInView, data } = useSectionPage<VideosData>('/data/videos.json')
  const { lang } = useLanguage()

  return (
    <>
      <SectionContainer id="videos" className="bg-white dark:bg-gray-950 pt-20">
        <SectionHeader
          sectionRef={ref}
          isInView={isInView}
          label={lang === 'de' ? 'Vergangene Feiern' : 'Geçmiş Törenler'}
          title={t(data?.titel, data?.titelTr, lang) || 'Videos'}
          description={t(data?.beschreibung, data?.beschreibungTr, lang)}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          {!data?.videos?.length ? (
            <div className="text-center py-16 text-gray-400">
              <p>
                {lang === 'de'
                  ? 'Videos werden in Kürze hinzugefügt.'
                  : 'Videolar yakında eklenecek.'}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.videos.map((video, i) => {
                const thumb =
                  video.typ === 'youtube' ? getYoutubeThumbnail(video.url) : video.vorschau
                const embedUrl = video.typ === 'youtube' ? getYoutubeEmbed(video.url) : null

                return (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
                  >
                    <div className="relative aspect-video bg-[#0a0a0a] group">
                      {thumb && (
                        <img
                          src={thumb}
                          alt={t(video.titel, video.titelTr, lang)}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                      {video.typ === 'youtube' && embedUrl ? (
                        <a
                          href={video.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors"
                          aria-label={`Video abspielen: ${t(video.titel, video.titelTr, lang)}`}
                        >
                          <div className="w-14 h-14 rounded-full bg-gold flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play size={22} className="text-black ml-1" fill="black" />
                          </div>
                        </a>
                      ) : video.typ === 'video' ? (
                        <video
                          src={video.url}
                          controls
                          poster={video.vorschau}
                          className="absolute inset-0 w-full h-full object-cover"
                          aria-label={t(video.titel, video.titelTr, lang)}
                        />
                      ) : null}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                        {t(video.titel, video.titelTr, lang)}
                      </h3>
                      {video.datum && (
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(video.datum).toLocaleDateString(
                            lang === 'de' ? 'de-DE' : 'tr-TR',
                            {
                              year: 'numeric',
                              month: 'long',
                            },
                          )}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </SectionContainer>
      <Footer />
    </>
  )
}
