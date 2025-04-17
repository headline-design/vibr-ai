"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
}

// Common emoji categories
const EMOJI_CATEGORIES = {
  recent: ["👍", "❤️", "😊", "👏", "🙏", "🔥", "😂", "✨", "🎉"],
  smileys: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘"],
  gestures: ["👋", "🤚", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉"],
  symbols: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "❤️‍🔥", "❤️‍🩹", "💔", "✨", "💫", "💥", "💢", "💦"],
}

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter emojis based on search query
  const filteredEmojis = searchQuery
    ? Object.values(EMOJI_CATEGORIES)
        .flat()
        .filter(
          (emoji) => emoji.includes(searchQuery) || getEmojiDescription(emoji).includes(searchQuery.toLowerCase()),
        )
    : null

  // Simple function to get emoji descriptions (in a real app, you'd have proper descriptions)
  function getEmojiDescription(emoji: string): string {
    const emojiMap: Record<string, string> = {
      "👍": "thumbs up like",
      "❤️": "heart love",
      "😊": "smile happy",
      "👏": "clap applause",
      "🙏": "pray thanks",
      "🔥": "fire hot",
      "😂": "laugh joy",
      "✨": "sparkles magic",
      "🎉": "party celebration",
      // Add more as needed
    }
    return emojiMap[emoji] || ""
  }

  return (
    <div className="p-2">
      <div className="relative mb-2">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search emoji"
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {searchQuery ? (
        <div className="grid grid-cols-7 gap-1 mt-2">
          {filteredEmojis?.map((emoji, index) => (
            <button
              key={`search-${index}`}
              className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
              onClick={() => onEmojiSelect(emoji)}
              aria-label={getEmojiDescription(emoji)}
            >
              {emoji}
            </button>
          ))}
          {filteredEmojis?.length === 0 && (
            <div className="col-span-7 py-4 text-center text-sm text-muted-foreground">No emojis found</div>
          )}
        </div>
      ) : (
        <Tabs defaultValue="recent">
          <div className="flex flex-row overflow-x-auto overflow-y-hidden scrollbar-hidden">
            <TabsList className="w-full mb-2 grid grid-cols-4 min-w-[280px]">
              <TabsTrigger value="recent" className="flex-1 text-xs">
                Recent
              </TabsTrigger>
              <TabsTrigger value="smileys" className="flex-1 text-xs">
                Smileys
              </TabsTrigger>
              <TabsTrigger value="gestures" className="flex-1 text-xs">
                Gestures
              </TabsTrigger>
              <TabsTrigger value="symbols" className="flex-1 text-xs">
                Symbols
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recent" className="mt-0">
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES.recent.map((emoji, index) => (
                <button
                  key={`recent-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                  onClick={() => onEmojiSelect(emoji)}
                  aria-label={getEmojiDescription(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="smileys" className="mt-0">
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES.smileys.map((emoji, index) => (
                <button
                  key={`smiley-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                  onClick={() => onEmojiSelect(emoji)}
                  aria-label={getEmojiDescription(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="gestures" className="mt-0">
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES.gestures.map((emoji, index) => (
                <button
                  key={`gesture-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                  onClick={() => onEmojiSelect(emoji)}
                  aria-label={getEmojiDescription(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="symbols" className="mt-0">
            <div className="grid grid-cols-7 gap-1">
              {EMOJI_CATEGORIES.symbols.map((emoji, index) => (
                <button
                  key={`symbol-${index}`}
                  className="h-8 w-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded"
                  onClick={() => onEmojiSelect(emoji)}
                  aria-label={getEmojiDescription(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
