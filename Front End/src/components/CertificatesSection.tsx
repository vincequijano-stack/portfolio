import React, { useState } from 'react';
import { certificatesData, Certificate } from '../data/certificates';
import { Award, ExternalLink, Maximize2, X, CheckCircle, ShieldCheck } from 'lucide-react';

export const CertificatesSection: React.FC = () => {
  const [activePdfCert, setActivePdfCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-12 border-t border-[#DBDBDB] dark:border-[#262626] text-left">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#0095F6]">
            Credentials &amp; Verification
          </span>
          <h2 className="text-2xl font-bold text-[#262626] dark:text-white mt-1">Certificates &amp; Honors</h2>
          <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mt-1">
            Verified course certifications, academic recognitions, and professional assessments.
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificatesData.map((cert) => (
            <article
              key={cert.id}
              className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* PDF Preview / Certificate Visual Container */}
              <div className="relative bg-[#0F172A] h-48 w-full overflow-hidden flex items-center justify-center border-b border-[#EFEFEF] dark:border-[#262626]">
                {cert.pdfUrl ? (
                  <>
                    <iframe
                      src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      title={cert.title}
                      className="w-full h-full pointer-events-none opacity-90"
                    />
                    {/* Hover Overlay with Preview Button */}
                    <div className="absolute inset-0 bg-black/40 hover:bg-black/50 transition-colors flex items-center justify-center">
                      <button
                        onClick={() => setActivePdfCert(cert)}
                        className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#262626] text-[#262626] dark:text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:bg-[#FAFAFA] dark:hover:bg-[#333333] transition-transform hover:scale-105"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>View Certificate PDF</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-white">
                    <ShieldCheck className="w-12 h-12 text-[#10B981] mb-2" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Academic Department Honor
                    </span>
                    <span className="text-[11px] text-[#94A3B8] mt-1">
                      Verified Transcripts on Request
                    </span>
                  </div>
                )}

                {/* Badge Tag Top-Left */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {cert.tag}
                </div>
              </div>

              {/* Certificate Body Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#8E8E8E] dark:text-[#737373] mb-1">
                    <span className="font-semibold text-[#262626] dark:text-white">{cert.issuer}</span>
                    <span>{cert.date}</span>
                  </div>

                  <h3 className="text-base font-bold text-[#262626] dark:text-white mb-2 leading-snug">
                    {cert.title}
                  </h3>

                  <p className="text-xs text-[#737373] dark:text-[#A8A8A8] leading-relaxed mb-4">
                    {cert.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {cert.skillsCovered.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-medium bg-[#FAFAFA] dark:bg-[#262626] border border-[#EFEFEF] dark:border-[#333333] text-[#4A4A4A] dark:text-[#D1D5DB] px-2 py-0.5 rounded"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-3 border-t border-[#EFEFEF] dark:border-[#262626] flex items-center justify-between">
                  {cert.credentialId && (
                    <span className="text-[10px] text-[#8E8E8E] dark:text-[#737373] font-mono">
                      ID: {cert.credentialId}
                    </span>
                  )}
                  {cert.pdfUrl ? (
                    <button
                      onClick={() => setActivePdfCert(cert)}
                      className="text-xs font-semibold text-[#0095F6] hover:text-[#1877F2] flex items-center gap-1 ml-auto"
                    >
                      <span>Full Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-[11px] text-[#10B981] font-medium ml-auto flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Full Certificate Lightbox Modal */}
      {activePdfCert && activePdfCert.pdfUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-modal-in"
          onClick={() => setActivePdfCert(null)}
        >
          <div
            className="bg-white dark:bg-[#1C1C1C] border border-[#DBDBDB] dark:border-[#262626] rounded-xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between bg-[#FAFAFA] dark:bg-[#141414]">
              <div>
                <h3 className="text-sm font-bold text-[#262626] dark:text-white">{activePdfCert.title}</h3>
                <p className="text-xs text-[#8E8E8E] dark:text-[#737373]">
                  Issued by {activePdfCert.issuer} · {activePdfCert.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activePdfCert.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#0095F6] text-white hover:bg-[#1877F2] transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Tab</span>
                </a>
                <button
                  onClick={() => setActivePdfCert(null)}
                  className="p-1.5 rounded-lg text-[#8E8E8E] hover:text-[#262626] dark:hover:text-white hover:bg-[#EFEFEF] dark:hover:bg-[#262626]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#1E293B]">
              <iframe
                src={activePdfCert.pdfUrl}
                title={activePdfCert.title}
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
