
import React from 'react';
import { Button } from './ui/button';
import { FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NoteDialogProps {
  displayLanguage: 'english' | 'french';
}

const NoteDialog = ({ displayLanguage }: NoteDialogProps) => {
  const [text, setText] = React.useState('');
  const { toast } = useToast();

  const handleSave = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `notes_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);

      toast({
        title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
        description: displayLanguage === 'english' 
          ? 'Your note has been saved to your computer' 
          : 'Votre note a été enregistrée sur votre ordinateur',
      });
    } catch (error) {
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english'
          ? 'Failed to save note'
          : 'Échec de l\'enregistrement de la note',
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <FileText className="h-4 w-4 mr-2" />
          {displayLanguage === 'english' ? 'Notepad' : 'Bloc-notes'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {displayLanguage === 'english' ? 'Notepad' : 'Bloc-notes'}
          </DialogTitle>
          <DialogDescription>
            {displayLanguage === 'english' 
              ? 'Write and save your notes to your computer' 
              : 'Écrivez et enregistrez vos notes sur votre ordinateur'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              displayLanguage === 'english'
                ? 'Write your notes here...'
                : 'Écrivez vos notes ici...'
            }
            className="min-h-[200px]"
          />
          
          <Button onClick={handleSave}>
            {displayLanguage === 'english' ? 'Save to Computer' : 'Enregistrer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
