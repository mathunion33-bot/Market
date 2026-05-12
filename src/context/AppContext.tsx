import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInAnonymously,
  signOut, 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  onSnapshot, 
  query, 
  where,
  addDoc,
  serverTimestamp,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { UserProfile, Product, CartItem, Order, OrderStatus, UserRole } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import toast from 'react-hot-toast';
import { generatePixPayload } from '../lib/pix';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface AppContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (observation?: string, isRecurring?: boolean) => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string, address: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Auth & Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        try {
          const docSnap = await getDoc(docRef);
          
          let userRole: UserRole = 'user';
          // Auto-promote the specific owner email
          if (user.email === 'mathunion33@gmail.com') {
            userRole = 'admin';
          }

          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            // Update role if it changed (e.g. was user, now admin)
            if (data.role !== userRole) {
              await updateDoc(docRef, { role: userRole });
              setProfile({ ...data, role: userRole });
            } else {
              setProfile(data);
            }
          } else {
            const newProfile: UserProfile = {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'Visitante',
              photoURL: user.photoURL || null,
              role: userRole,
              createdAt: serverTimestamp(),
            };
            await setDoc(docRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Products
  useEffect(() => {
    const q = collection(db, 'products');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods: Product[] = [];
      snapshot.forEach((doc) => {
        prods.push({ id: doc.id, ...doc.data() } as Product);
      });
      
      // We don't fallback to MOCK if we have a connection
      setProducts(prods);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    return () => unsubscribe();
  }, []);

  // Orders
  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    let q = query(collection(db, 'orders'), where('userId', '==', user.uid));
    
    // If admin, show all orders
    if (profile?.role === 'admin') {
      q = collection(db, 'orders');
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach((doc) => {
        ords.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ords.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'orders');
    });

    return () => unsubscribe();
  }, [user, profile]);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer login com Google.');
    }
  };

  const loginAnonymously = async () => {
    try {
      await signInAnonymously(auth);
      toast.success('Entrando como Visitante');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao entrar como visitante.');
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao fazer login com e-mail.');
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string, address: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: name,
        address: address,
        photoURL: null,
        role: 'user',
        createdAt: serverTimestamp(),
      };
      await setDoc(doc(db, 'users', user.uid), newProfile);
      setProfile(newProfile);
      
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar conta.');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Você saiu da sua conta.');
    } catch (error) {
      console.error(error);
      toast.error('Erro ao sair.');
    }
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => 
      prev.map((item) => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkout = async (observation: string = '', isRecurring: boolean = false) => {
    if (!user || cart.length === 0) return null;

    const total = (cart || []).reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
    
    try {
      const maxLeadTime = cart.reduce((max, item) => Math.max(max, item.deliveryDays || 1), 1);
      const deliveryDateObj = new Date();
      deliveryDateObj.setDate(deliveryDateObj.getDate() + maxLeadTime);
      const deliveryDate = deliveryDateObj.toLocaleDateString('pt-BR');

      const orderData: Omit<Order, 'id'> = {
        userId: user.uid,
        userEmail: user.email || '',
        userName: profile?.displayName || user.displayName || 'Visitante',
        address: profile?.address || 'Endereço não informado',
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        total,
        status: 'received',
        createdAt: serverTimestamp(),
        deliveryDate,
        observation,
        isRecurring,
        pixCode: generatePixPayload('+5511941774380', 'OFFICE MARKET', 'SAO PAULO', total)
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      toast.success('Pedido realizado com sucesso!');
      return docRef.id;
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, 'orders');
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (profile?.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      toast.success('Status do pedido atualizado!');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addProduct = async (productData: Omit<Product, 'id'>) => {
    if (profile?.role !== 'admin') return;
    try {
      await addDoc(collection(db, 'products'), productData);
      toast.success('Produto adicionado com sucesso!');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>) => {
    if (profile?.role !== 'admin') return;
    try {
      await updateDoc(doc(db, 'products', productId), updates);
      toast.success('Produto atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `products/${productId}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    if (profile?.role !== 'admin') return;
    try {
      await deleteDoc(doc(db, 'products', productId));
      toast.success('Produto removido!');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success('Perfil atualizado!');
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      toast.error('Erro ao atualizar perfil.');
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      profile,
      loading,
      products,
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      checkout,
      loginWithGoogle,
      loginAnonymously,
      loginWithEmail,
      signUpWithEmail,
      logout,
      isAdmin: profile?.role === 'admin',
      updateOrderStatus,
      addProduct,
      updateProduct,
      deleteProduct,
      updateProfile
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
