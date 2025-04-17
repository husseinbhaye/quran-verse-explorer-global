
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
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';

interface NoteDialogProps {
  surahId: number;
  ayahNumber: number;
  displayLanguage: 'english' | 'french';
}

const NoteDialog = ({ surahId, ayahNumber, displayLanguage }: NoteDialogProps) => {
  const { note, saveNote, path, setPath } = useNotes(surahId, ayahNumber);
  const [inputValue, setInputValue] = React.useState(note);
  const [pathValue, setPathValue] = React.useState(path);
  const { toast } = useToast();

  React.useEffect(() => {
    setInputValue(note);
  }, [note]);

  const handleSave = () => {
    saveNote(inputValue, pathValue);
    toast({
      title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
      description: displayLanguage === 'english' 
        ? `Your note has been saved to path: ${pathValue}` 
        : `Votre note a été enregistrée dans le chemin: ${pathValue}`,
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
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {displayLanguage === 'english' ? 'Storage Path' : 'Chemin de stockage'}
            </label>
            <Input
              value={pathValue}
              onChange={(e) => setPathValue(e.target.value)}
              placeholder={displayLanguage === 'english' ? 'Enter storage path' : 'Entrez le chemin de stockage'}
              className="w-full"
            />
          </div>
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
