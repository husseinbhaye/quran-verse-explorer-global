
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { PostcardGeneratorProps } from '../types';
import { usePostcard } from './usePostcard';

const PostcardGenerator = ({ ayah, surahName, displayLanguage, translationContent }: PostcardGeneratorProps) => {
  const { createPostcard } = usePostcard({ ayah, surahName, displayLanguage, translationContent });

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={createPostcard}
      className="bg-white/10 hover:bg-white/20 text-quran-primary dark:text-quran-secondary"
      title={displayLanguage === 'english' ? 'Save as postcard' : 'Enregistrer comme carte postale'}
    >
      <Download size={18} />
    </Button>
  );
};

export default PostcardGenerator;
