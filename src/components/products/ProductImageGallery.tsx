import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, ImagePlus, ChevronLeft, ChevronRight, ZoomIn, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useToast } from '@/hooks/use-toast';
import { ProductImage } from '@/types';

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  onImagesChange?: (images: ProductImage[]) => void;
  editable?: boolean;
}

const ProductImageGallery = ({ 
  images: initialImages, 
  productName, 
  onImagesChange,
  editable = true 
}: ProductImageGalleryProps) => {
  const [images, setImages] = useState<ProductImage[]>(initialImages);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const selectedImage = images[selectedIndex];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ProductImage[] = [];
    
    Array.from(files).forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload only image files.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ProductImage = {
          id: `upload-${Date.now()}-${index}`,
          url: event.target?.result as string,
          alt: `${productName} - Uploaded image ${images.length + index + 1}`,
          isPrimary: images.length === 0 && index === 0,
          uploadedAt: new Date().toISOString(),
        };
        
        setImages(prev => {
          const updated = [...prev, newImage];
          onImagesChange?.(updated);
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    toast({
      title: 'Images uploaded',
      description: `${files.length} image(s) added successfully.`,
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id);
      if (selectedIndex >= updated.length) {
        setSelectedIndex(Math.max(0, updated.length - 1));
      }
      onImagesChange?.(updated);
      return updated;
    });
    toast({
      title: 'Image removed',
      description: 'The image has been removed from the gallery.',
    });
  };

  const handleSetPrimary = (id: string) => {
    setImages(prev => {
      const updated = prev.map(img => ({
        ...img,
        isPrimary: img.id === id
      }));
      onImagesChange?.(updated);
      return updated;
    });
    toast({
      title: 'Primary image set',
      description: 'This image will be displayed as the main product image.',
    });
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setSelectedIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  if (images.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Product Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">No images yet</p>
            {editable && (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Click or drag to upload product images
                </p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Images
                </Button>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Product Images</CardTitle>
          {editable && (
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Add More
            </Button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileUpload}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main Image */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>
            <motion.div 
              className="relative rounded-lg overflow-hidden cursor-zoom-in group"
              whileHover={{ scale: 1.01 }}
            >
              <AspectRatio ratio={4/3}>
                <img
                  src={selectedImage?.url || '/placeholder.svg'}
                  alt={selectedImage?.alt || productName}
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              {selectedImage?.isPrimary && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Primary
                </div>
              )}
            </motion.div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl p-0 bg-black/95">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                onClick={() => setIsLightboxOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    onClick={() => navigateImage('prev')}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                    onClick={() => navigateImage('next')}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
              
              <img
                src={selectedImage?.url || '/placeholder.svg'}
                alt={selectedImage?.alt || productName}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-3 py-1 rounded">
                {selectedIndex + 1} / {images.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group"
                >
                  <button
                    onClick={() => setSelectedIndex(index)}
                    className={`w-full rounded-lg overflow-hidden border-2 transition-all ${
                      selectedIndex === index 
                        ? 'border-primary ring-2 ring-primary/20' 
                        : 'border-transparent hover:border-muted-foreground/30'
                    }`}
                  >
                    <AspectRatio ratio={1}>
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="object-cover w-full h-full"
                      />
                    </AspectRatio>
                  </button>
                  
                  {editable && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-lg">
                      {!image.isPrimary && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-white hover:bg-white/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimary(image.id);
                          }}
                          title="Set as primary"
                        >
                          <ImagePlus className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-white hover:bg-red-500/50"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage(image.id);
                        }}
                        title="Delete image"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  
                  {image.isPrimary && (
                    <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1 rounded">
                      Main
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductImageGallery;
