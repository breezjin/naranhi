'use client'

import { useState } from 'react'
import { HelpCircle, Keyboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'

interface ShortcutHelpProps {
  variant?: 'icon' | 'button'
  className?: string
}

export function ShortcutHelp({ variant = 'icon', className }: ShortcutHelpProps) {
  const [open, setOpen] = useState(false)
  const { shortcuts } = useGlobalShortcuts()

  const formatKey = (key: string, modifiers: any) => {
    const keys = []
    
    if (modifiers.meta) keys.push('⌘')
    if (modifiers.ctrl) keys.push('Ctrl')
    if (modifiers.alt) keys.push('Alt')
    if (modifiers.shift) keys.push('Shift')
    
    keys.push(key.toUpperCase())
    
    return keys.join(' + ')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button
            variant="ghost"
            size="icon"
            className={className}
            title="키보드 단축키 도움말"
          >
            <Keyboard className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className={className}>
            <HelpCircle className="mr-2 h-4 w-4" />
            단축키 도움말
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            키보드 단축키
          </DialogTitle>
          <DialogDescription>
            빠른 내비게이션을 위한 키보드 단축키를 사용해보세요.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
            >
              <span className="text-sm text-muted-foreground">
                {shortcut.description}
              </span>
              <kbd className="inline-flex items-center px-2 py-1 text-xs font-mono font-semibold bg-background border border-border rounded">
                {formatKey(shortcut.key, shortcut.modifiers)}
              </kbd>
            </div>
          ))}
          
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💡 <strong>팁:</strong> 입력 필드나 모달이 열려있을 때는 단축키가 비활성화됩니다.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShortcutHelp