
import React from 'react';
import { Button } from './ui/button';
import { Pencil, FolderOpen, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from './ui/dialog';
import { useNotes } from '@/hooks/useNotes';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from './ui/alert';

interface NoteDialogProps {
  surahId: number;
  ayahNumber: number;
  displayLanguage: 'english' | 'french';
}

const NoteDialog = ({ surahId, ayahNumber, displayLanguage }: NoteDialogProps) => {
  const { 
    note, 
    saveNote, 
    path, 
    setPath, 
    basePath, 
    isFileSystemAccessSupported, 
    chooseFileLocation,
    fsApiAvailable 
  } = useNotes(surahId, ayahNumber);
  const [inputValue, setInputValue] = React.useState(note);
  const [pathValue, setPathValue] = React.useState(path);
  const { toast } = useToast();

  React.useEffect(() => {
    setInputValue(note);
  }, [note]);

  const handleSave = async () => {
    try {
      const success = await saveNote(inputValue, pathValue);
      
      if (success) {
        toast({
          title: displayLanguage === 'english' ? 'Note saved' : 'Note enregistrée',
          description: displayLanguage === 'english' 
            ? `Your note has been saved ${!isFileSystemAccessSupported ? 'locally' : ''}` 
            : `Votre note a été enregistrée ${!isFileSystemAccessSupported ? 'localement' : ''}`,
        });
      } else {
        toast({
          title: displayLanguage === 'english' ? 'Note saved locally' : 'Note enregistrée localement',
          description: displayLanguage === 'english' 
            ? 'Could not save to file system, but your note is saved in browser storage.' 
            : 'Impossible de sauvegarder dans le système de fichiers, mais votre note est enregistrée dans le stockage du navigateur.',
          variant: "default"
        });
      }
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
    } else {
      toast({
        title: displayLanguage === 'english' ? 'Could not select location' : 'Impossible de sélectionner l\'emplacement',
        description: displayLanguage === 'english' 
          ? 'Could not access file system. Notes will be saved locally.' 
          : 'Impossible d\'accéder au système de fichiers. Les notes seront enregistrées localement.',
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
          <DialogDescription>
            {displayLanguage === 'english' 
              ? 'Add notes or translations for this verse' 
              : 'Ajoutez des notes ou des traductions pour ce verset'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {fsApiAvailable === false && (
            <Alert variant="warning" className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                {displayLanguage === 'english' 
                  ? 'File system access is not available in this environment. Notes will be saved in your browser only.' 
                  : 'L\'accès au système de fichiers n\'est pas disponible dans cet environnement. Les notes ne seront enregistrées que dans votre navigateur.'}
              </AlertDescription>
            </Alert>
          )}
          
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
          
          {fsApiAvailable === null && !isFileSystemAccessSupported && (
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
