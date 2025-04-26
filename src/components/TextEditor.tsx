
import React, { useState } from 'react';
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
  RemoveFormatting
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextEditorProps {
  displayLanguage: 'english' | 'french';
}

const TextEditor = ({ displayLanguage }: TextEditorProps) => {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleFormat = (format: string) => {
    const textarea = document.querySelector('textarea');
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

  const handleSave = () => {
    try {
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes_${new Date().toISOString().slice(0, 10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {displayLanguage === 'english' ? 'Text Editor' : 'Éditeur de texte'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>
            {displayLanguage === 'english' ? 'Text Editor' : 'Éditeur de texte'}
          </DialogTitle>
        </DialogHeader>
        
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
        
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-[400px] font-mono"
          placeholder={displayLanguage === 'english' ? 'Start writing...' : 'Commencez à écrire...'}
        />
        
        <Button onClick={handleSave} className="mt-4">
          {displayLanguage === 'english' ? 'Save to Computer' : 'Enregistrer'}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default TextEditor;
