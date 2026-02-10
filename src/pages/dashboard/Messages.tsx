import { motion } from "framer-motion";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";

const conversations = [
  {
    id: 1,
    client: "Orange Guinée",
    avatar: "/avatars/client-5.jpg",
    lastMessage: "Parfait, merci pour la mise à jour !",
    time: "Il y a 5 min",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    client: "Ecobank Guinée",
    avatar: "/avatars/client-6.jpg",
    lastMessage: "Pouvez-vous m'envoyer le mockup ?",
    time: "Il y a 1h",
    unread: 1,
    online: false,
  },
  {
    id: 3,
    client: "UBA Guinée",
    avatar: "/avatars/client-7.jpg",
    lastMessage: "Le projet avance bien, continuez !",
    time: "Il y a 3h",
    unread: 0,
    online: true,
  },
  {
    id: 4,
    client: "MTN Guinée",
    avatar: "/avatars/client-8.jpg",
    lastMessage: "Merci pour votre proposition",
    time: "Hier",
    unread: 0,
    online: false,
  },
];

const messages = [
  { id: 1, sender: "client", text: "Bonjour Amadou, comment avance le projet ?", time: "10:30" },
  { id: 2, sender: "me", text: "Bonjour ! Le projet avance très bien. J'ai terminé 75% du développement.", time: "10:32" },
  { id: 3, sender: "client", text: "Excellent ! Pouvez-vous me montrer une démo ?", time: "10:35" },
  { id: 4, sender: "me", text: "Bien sûr, je vous envoie le lien dans quelques minutes.", time: "10:36" },
  { id: 5, sender: "client", text: "Parfait, merci pour la mise à jour !", time: "10:40" },
];

const Messages = () => {
  const [selectedConv, setSelectedConv] = useState(1);
  const [messageText, setMessageText] = useState("");

  return (
    <DashboardLayout userType="freelancer">
      <Card className="h-[calc(100vh-12rem)] flex overflow-hidden">
        {/* Conversations List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input placeholder="Rechercher..." className="pl-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                onClick={() => setSelectedConv(conv.id)}
                className={`p-4 cursor-pointer border-b border-border ${
                  selectedConv === conv.id ? "bg-muted" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <img 
                      src={conv.avatar} 
                      alt={conv.client}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold truncate">{conv.client}</h4>
                      <span className="text-xs text-muted-foreground">{conv.time}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <Badge className="bg-primary text-white ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/avatars/client-1.jpg" 
                alt="Orange Guinée"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold">Orange Guinée</h3>
                <p className="text-xs text-primary">En ligne</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical size={20} />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-md ${message.sender === "me" ? "order-2" : ""}`}>
                  <div
                    className={`p-3 rounded-2xl ${
                      message.sender === "me"
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-2">{message.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Paperclip size={20} />
              </Button>
              <Input
                placeholder="Écrivez votre message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};

export default Messages;
