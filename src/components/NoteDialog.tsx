
import React from 'react';
import { Button } from './ui/button';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { useNotes } from '@/hooks/useNotes';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface NoteDialogProps {
  surahId: number;
  ayahNumber: number;
  displayLanguage: 'english' | 'french';
}

const NoteDialog = ({ surahId, ayahNumber, displayLanguage }: NoteDialogProps) => {
  const { note, saveNote } = useNotes(surahId, ayahNumber);
  const [inputValue, setInputValue] = React.useState(note);
  const { toast } = useToast();

  React.useEffect(() => {
    setInputValue(note);
  }, [note]);

  const handleSave = () => {
    saveNote(inputValue);
    toast({
      title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
      description: displayLanguage === 'english' 
        ? 'Your note has been saved successfully' 
        : 'Votre note a été enregistrée avec succès',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Pencil className="h-4 w-4 mr-2" />
          {displayLanguage === 'english' ? 'Add Note' : 'Ajouter une note'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {displayLanguage === 'english' ? 'Your Notes' : 'Vos notes'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              displayLanguage === 'english'
                ? 'Write your notes or translation here...'
                : 'Écrivez vos notes ou votre traduction ici...'
            }
            className="min-h-[200px]"
          />
          <Button onClick={handleSave}>
            {displayLanguage === 'english' ? 'Save Note' : 'Enregistrer la note'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
