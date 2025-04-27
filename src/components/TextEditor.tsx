
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from './ui/menubar';
import { 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  IndentDecrease,
  IndentIncrease,
  Strikethrough,
  Subscript,
  Superscript,
  WrapText,
  RemoveFormatting,
  Save,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface TextEditorProps {
  displayLanguage: 'english' | 'french';
}

const TextEditor = ({ displayLanguage }: TextEditorProps) => {
  const [text, setText] = useState('');
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [currentFileHandle, setCurrentFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // Check if File System Access API is supported
  const isFileSystemAccessSupported = () => {
    return 'showSaveFilePicker' in window;
  };

  const handleFormat = (format: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = text.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `_${selectedText}_`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedText}~~`;
        break;
      case 'subscript':
        formattedText = `<sub>${selectedText}</sub>`;
        break;
      case 'superscript':
        formattedText = `<sup>${selectedText}</sup>`;
        break;
      case 'align-left':
        formattedText = `<div style="text-align: left">${selectedText}</div>`;
        break;
      case 'align-center':
        formattedText = `<div style="text-align: center">${selectedText}</div>`;
        break;
      case 'align-right':
        formattedText = `<div style="text-align: right">${selectedText}</div>`;
        break;
      case 'indent-increase':
        formattedText = selectedText.split('\n').map(line => `  ${line}`).join('\n');
        break;
      case 'indent-decrease':
        formattedText = selectedText.split('\n').map(line => line.replace(/^  /, '')).join('\n');
        break;
      case 'wrap-text':
        formattedText = selectedText.split('').join('\n');
        break;
      case 'remove-formatting':
        formattedText = selectedText.replace(/[*_~<>{}[\]()#`]/g, '');
        break;
      default:
        formattedText = selectedText;
    }

    const newText = text.substring(0, start) + formattedText + text.substring(end);
    setText(newText);
    
    // Restore focus to textarea
    textarea.focus();
    
    // Set selection after formatting
    setTimeout(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = start + formattedText.length;
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newText = text.substring(0, start) + '  ' + text.substring(end);
      setText(newText);
      
      // Set cursor position after indentation
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleSaveAs = async () => {
    try {
      if (isFileSystemAccessSupported()) {
        // Modern browsers with File System Access API
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: currentFileName || `notes_${new Date().toISOString().slice(0, 10)}.txt`,
          types: [
            {
              description: 'Text Files',
              accept: {
                'text/plain': ['.txt'],
              },
            },
          ],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        
        setCurrentFileHandle(fileHandle);
        setCurrentFileName(fileHandle.name);
        
        toast({
          title: displayLanguage === 'english' ? 'File saved' : 'Fichier enregistré',
          description: displayLanguage === 'english' 
            ? `Saved as ${fileHandle.name}` 
            : `Enregistré sous ${fileHandle.name}`,
        });
      } else {
        // Fallback for browsers without File System Access API
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const filename = `notes_${new Date().toISOString().slice(0, 10)}.txt`;
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setCurrentFileName(filename);
        
        toast({
          title: displayLanguage === 'english' ? 'File saved' : 'Fichier enregistré',
          description: displayLanguage === 'english' 
            ? `Saved as ${filename}` 
            : `Enregistré sous ${filename}`,
        });
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english'
          ? 'Failed to save file'
          : 'Échec de l\'enregistrement du fichier',
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    try {
      if (currentFileHandle) {
        // Save to existing file
        const writable = await currentFileHandle.createWritable();
        await writable.write(text);
        await writable.close();
        
        toast({
          title: displayLanguage === 'english' ? 'File saved' : 'Fichier enregistré',
          description: displayLanguage === 'english' 
            ? `Saved to ${currentFileName}` 
            : `Enregistré dans ${currentFileName}`,
        });
      } else {
        // No existing file, use Save As instead
        await handleSaveAs();
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast({
        title: displayLanguage === 'english' ? 'Error' : 'Erreur',
        description: displayLanguage === 'english'
          ? 'Failed to save file'
          : 'Échec de l\'enregistrement du fichier',
        variant: "destructive",
      });
    }
  };

  const handleNewDocument = () => {
    if (text.trim() !== '') {
      const confirmNew = window.confirm(
        displayLanguage === 'english' 
          ? 'Create new document? Any unsaved changes will be lost.' 
          : 'Créer un nouveau document ? Tous les changements non enregistrés seront perdus.'
      );
      
      if (confirmNew) {
        setText('');
        setCurrentFileName(null);
        setCurrentFileHandle(null);
      }
    } else {
      setText('');
      setCurrentFileName(null);
      setCurrentFileHandle(null);
    }
  };

  const formatButtons = [
    { icon: Bold, action: 'bold', tooltip: 'Bold' },
    { icon: Italic, action: 'italic', tooltip: 'Italic' },
    { icon: Underline, action: 'underline', tooltip: 'Underline' },
    { icon: Strikethrough, action: 'strikethrough', tooltip: 'Strikethrough' },
    { icon: Subscript, action: 'subscript', tooltip: 'Subscript' },
    { icon: Superscript, action: 'superscript', tooltip: 'Superscript' },
    { icon: AlignLeft, action: 'align-left', tooltip: 'Align Left' },
    { icon: AlignCenter, action: 'align-center', tooltip: 'Align Center' },
    { icon: AlignRight, action: 'align-right', tooltip: 'Align Right' },
    { icon: IndentDecrease, action: 'indent-decrease', tooltip: 'Decrease Indent' },
    { icon: IndentIncrease, action: 'indent-increase', tooltip: 'Increase Indent' },
    { icon: WrapText, action: 'wrap-text', tooltip: 'Wrap Text' },
    { icon: RemoveFormatting, action: 'remove-formatting', tooltip: 'Remove Formatting' },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {displayLanguage === 'english' ? 'Text Editor' : 'Éditeur de texte'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {currentFileName || (displayLanguage === 'english' ? 'Untitled Document' : 'Document sans titre')}
          </DialogTitle>
        </DialogHeader>
        
        <Menubar className="mt-2">
          <MenubarMenu>
            <MenubarTrigger>
              {displayLanguage === 'english' ? 'File' : 'Fichier'}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewDocument}>
                {displayLanguage === 'english' ? 'New' : 'Nouveau'}
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSave}>
                {displayLanguage === 'english' ? 'Save' : 'Enregistrer'}
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={handleSaveAs}>
                {displayLanguage === 'english' ? 'Save As...' : 'Enregistrer sous...'}
                <MenubarShortcut>⇧⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => setIsDialogOpen(false)}>
                {displayLanguage === 'english' ? 'Close' : 'Fermer'}
                <MenubarShortcut>⌘W</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>
              {displayLanguage === 'english' ? 'Format' : 'Format'}
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => handleFormat('bold')}>
                {displayLanguage === 'english' ? 'Bold' : 'Gras'}
                <MenubarShortcut>⌘B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => handleFormat('italic')}>
                {displayLanguage === 'english' ? 'Italic' : 'Italique'}
                <MenubarShortcut>⌘I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => handleFormat('underline')}>
                {displayLanguage === 'english' ? 'Underline' : 'Souligner'}
                <MenubarShortcut>⌘U</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => handleFormat('remove-formatting')}>
                {displayLanguage === 'english' ? 'Clear Formatting' : 'Effacer le formatage'}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        
        <div className="flex flex-wrap gap-2 mb-2 p-2 border rounded-md">
          {formatButtons.map(({ icon: Icon, action, tooltip }) => (
            <Button
              key={action}
              variant="outline"
              size="sm"
              onClick={() => handleFormat(action)}
              title={tooltip}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
        
        <div className="flex-1 relative min-h-0">
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="absolute inset-0 resize-none font-mono min-h-full"
            placeholder={displayLanguage === 'english' ? 'Start writing...' : 'Commencez à écrire...'}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="text-xs text-gray-500">
            {currentFileName 
              ? (displayLanguage === 'english' ? `File: ${currentFileName}` : `Fichier: ${currentFileName}`) 
              : (displayLanguage === 'english' ? 'Unsaved document' : 'Document non enregistré')}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  {displayLanguage === 'english' ? 'Save' : 'Enregistrer'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSave}>
                  {displayLanguage === 'english' ? 'Save' : 'Enregistrer'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSaveAs}>
                  {displayLanguage === 'english' ? 'Save As...' : 'Enregistrer sous...'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button onClick={() => setIsDialogOpen(false)}>
              {displayLanguage === 'english' ? 'Close' : 'Fermer'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextEditor;
