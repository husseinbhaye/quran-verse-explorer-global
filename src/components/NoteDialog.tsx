
import React from 'react';
import { Button } from './ui/button';
import { Pencil, FolderOpen } from 'lucide-react';
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
  const { note, saveNote, path, setPath, basePath, isFileSystemAccessSupported, chooseFileLocation } = useNotes(surahId, ayahNumber);
  const [inputValue, setInputValue] = React.useState(note);
  const [pathValue, setPathValue] = React.useState(path);
  const { toast } = useToast();

  React.useEffect(() => {
    setInputValue(note);
  }, [note]);

  const handleSave = async () => {
    try {
      await saveNote(inputValue, pathValue);
      toast({
        title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
        description: displayLanguage === 'english' 
          ? `Your note has been saved to: ${pathValue}` 
          : `Votre note a été enregistrée dans: ${pathValue}`,
      });
    } catch (error) {
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english' 
          ? 'Failed to save note. Please try again.' 
          : 'Échec de l\'enregistrement de la note. Veuillez réessayer.',
        variant: "destructive"
      });
    }
  };

  const handleChooseLocation = async () => {
    const success = await chooseFileLocation();
    if (success) {
      toast({
        title: displayLanguage === 'english' ? 'File Location Selected' : 'Emplacement de fichier sélectionné',
        description: displayLanguage === 'english' 
          ? 'You have selected where to save the note.' 
          : 'Vous avez choisi où enregistrer la note.',
      });
    }
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
            <div className="flex gap-2">
              <Input
                value={pathValue}
                onChange={(e) => setPathValue(e.target.value)}
                placeholder={basePath}
                className="w-full"
              />
              {isFileSystemAccessSupported && (
                <Button 
                  variant="outline" 
                  onClick={handleChooseLocation} 
                  title={displayLanguage === 'english' ? 'Choose file location' : 'Choisir l\'emplacement du fichier'}
                >
                  <FolderOpen className="h-4 w-4" />
                </Button>
              )}
            </div>
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
          {!isFileSystemAccessSupported && (
            <p className="text-sm text-yellow-600">
              {displayLanguage === 'english' 
                ? 'File system access is not supported in your browser. Notes will be saved locally only.' 
                : 'L\'accès au système de fichiers n\'est pas pris en charge dans votre navigateur. Les notes seront enregistrées uniquement localement.'}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoteDialog;
