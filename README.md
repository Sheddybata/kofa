# KofaSentinel ATLAS

A modern, profile-based access control system built with React, TypeScript, and Tailwind CSS. KofaSentinel ATLAS provides comprehensive visitor and vehicle management for secure facilities.

## 🚀 Features

### **Profile-Based System**
- **Individual Profiles**: Manage people with contact information, photos, and notes
- **Vehicle Profiles**: Track vehicles with driver information and plate numbers
- **Linked Profiles**: Connect vehicles to individuals for comprehensive tracking

### **Guard Interface** (`/gate`)
- **Unified Search**: Search by name, phone number, or plate number
- **Quick Registration**: Register new profiles on-the-fly
- **Instant Logging**: Log entries with purpose and notes
- **Real-time Activity**: View recent access activity

### **Admin Dashboard** (`/dashboard`)
- **Access Management**: Monitor all entries and exits
- **Profile Management**: View, edit, and manage all profiles
- **Security Features**: Blacklist management and security alerts
- **Data Export**: Export access logs and reports

### **Security Features**
- **Blacklist Management**: Flag restricted individuals/vehicles
- **Access Logs**: Complete audit trail of all entries
- **Real-time Monitoring**: Live updates of facility access
- **Data Persistence**: Local storage for offline functionality

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **UI Components**: Shadcn/ui + Tailwind CSS
- **State Management**: React Context API
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Storage**: Local Storage (easily replaceable with backend)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sheddybata/kofa.git
   cd kofa
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8080
   ```

## 🎯 Usage

### **For Guards**
1. Navigate to `/gate`
2. Search for existing profiles or register new ones
3. Log entries with purpose and notes
4. Monitor recent activity

### **For Administrators**
1. Navigate to `/dashboard`
2. View comprehensive access logs
3. Manage profiles and blacklist
4. Export data and generate reports

## 📱 Responsive Design

- **Mobile-First**: Optimized for tablet and mobile use
- **Touch-Friendly**: Large buttons and intuitive gestures
- **Professional UI**: Clean, modern interface design

## 🔧 Configuration

### **Environment Setup**
- No environment variables required for basic functionality
- Local storage handles data persistence
- Easy integration with backend APIs

### **Customization**
- Modify `src/types/index.ts` for data structure changes
- Update `src/contexts/AppContext.tsx` for business logic
- Customize UI components in `src/components/`

## 📊 Data Structure

### **Profile Types**
```typescript
interface Profile {
  profileId: string;
  profileType: 'Individual' | 'Vehicle';
  name: string;
  identifier: string; // Phone for individuals, Plate for vehicles
  photoUrl?: string;
  notes?: string;
  isBlacklisted: boolean;
  // Additional fields for individuals
  email?: string;
  company?: string;
  // Additional fields for vehicles
  driverName?: string;
  driverPhone?: string;
}
```

### **Access Logs**
```typescript
interface AccessLog {
  logId: string;
  profileId: string;
  entryTime: string;
  exitTime?: string;
  status: 'Inside' | 'Exited';
  purpose?: string;
  guardNotes?: string;
}
```

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Preview Production Build**
```bash
npm run preview
```

### **Deploy to Vercel/Netlify**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Sheddybata**
- GitHub: [@Sheddybata](https://github.com/Sheddybata)
- Repository: [https://github.com/Sheddybata/kofa](https://github.com/Sheddybata/kofa)

## 🙏 Acknowledgments

- Built with [Shadcn/ui](https://ui.shadcn.com/) components
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**KofaSentinel ATLAS** - Secure, Modern, Professional Access Control