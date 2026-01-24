import { Button } from "@/components/ui/button";
import { QrCode } from "lucide-react";

export default function AppPromotion() {
  return (
    <div className="my-8 sm:my-10 md:my-12 bg-blue-900 rounded-lg overflow-hidden relative">
      <div className="px-4 sm:px-6 md:px-10 py-8 md:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="max-w-lg mb-0 order-1 md:order-none">
          <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3">
            Drive smart with our app
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-4 sm:mb-6">
            Get exclusive deals, service updates, and more through our app. Download now for the best car buying and selling experience.
          </p>
        </div>
        <div className="flex flex-col items-center text-center order-2 md:order-none">
          <div className="bg-white p-2 sm:p-3 rounded-lg mb-1 sm:mb-2 flex-shrink-0">
            <QrCode className="h-20 w-20 sm:h-24 sm:w-24 text-gray-400" />
          </div>
          <span className="text-white text-xs sm:text-sm whitespace-nowrap">Scan to download</span>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-85 hidden sm:block">
          <img 
            src="https://images.pexels.com/photos/8127035/pexels-photo-8127035.jpeg" 
            alt="People with mobile phones" 
            className="h-32 sm:h-48 md:h-60 w-auto object-cover rounded-tl-lg"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}