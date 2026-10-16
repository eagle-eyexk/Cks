import { type ReactNode, useEffect, useRef } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { ClerkProvider, SignIn, SignUp, useAuth, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { deDE, enUS } from '@clerk/localizations';
import { shadcn } from '@clerk/themes';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ErrorBoundary } from '@/components/error-boundary';
import { Shell } from '@/components/shell';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Activity from '@/pages/activity';
import CardPage from '@/pages/card';
import Dashboard from '@/pages/dashboard';
import Home from '@/pages/home';
import Markets from '@/pages/markets';
import NotFound from '@/pages/not-found';
import SettingsPage from '@/pages/settings';
import Trade from '@/pages/trade';
import Wallet from '@/pages/wallet';
import { DemoProvider } from '@/lib/demo-store';
import { LanguageProvider, useLanguage } from '@/lib/i18n';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath)
    ? path.slice(basePath.length) || '/'
    : path;
}

if (!clerkPubKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in Replit Secrets');
}

const clerkAppearance = {
  theme: shadcn,
  cssLayerName: 'clerk',
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#243e5d',
    colorForeground: '#233b56',
    colorMutedForeground: '#667784',
    colorDanger: '#a64e41',
    colorBackground: '#fffefa',
    colorInput: '#ffffff',
    colorInputForeground: '#243e5d',
    colorNeutral: '#ded9cf',
    fontFamily: 'DM Sans, sans-serif',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full flex justify-center',
    cardBox:
      'bg-[#fffefa] border border-[#e4e2dc] shadow-xl rounded-2xl w-[440px] max-w-full overflow-hidden',
    card: '!shadow-none !border-0 !bg-transparent !rounded-none',
    footer: '!shadow-none !border-0 !bg-transparent !rounded-none',
    headerTitle: '!text-[#233b56] font-semibold tracking-tight',
    headerSubtitle: '!text-[#526880]',
    socialButtonsBlockButtonText: '!text-[#263b52] font-medium',
    formFieldLabel: '!text-[#405469] font-medium',
    footerActionLink: '!text-[#28496a] font-semibold',
    footerActionText: '!text-[#667784]',
    dividerText: '!text-[#7b8790] text-xs',
    identityPreviewEditButton: '!text-[#304f6c]',
    formFieldSuccessText: '!text-[#44795a]',
    alertText: '!text-[#893f36]',
    logoBox: 'justify-start',
    logoImage: 'max-h-10',
    socialButtonsBlockButton:
      '!border !border-[#e1ddd4] !bg-white hover:!bg-[#f7f5ef]',
    formButtonPrimary: '!bg-[#243e5d] hover:!bg-[#1b314b] !text-white',
    formFieldInput:
      '!border-[#ddd9d0] !bg-white !text-[#243e5d] focus:!border-[#6488a7]',
    footerAction: '!text-[#667784]',
    dividerLine: '!bg-[#e5e1d7]',
    alert: '!border-[#e9cbc6] !bg-[#fff6f3]',
    otpCodeFieldInput: '!border-[#ddd9d0] !bg-white !text-[#243e5d]',
    formFieldRow: '',
    main: '',
  },
};

function HomeRoute() {
  const { isLoaded, isSignedIn } = useAuth();
  const { t } = useLanguage();

  if (!isLoaded) {
    return <div className="cks-loading" role="status">{t('Loading CKS…')}</div>;
  }

  return isSignedIn ? <Redirect to="/dashboard" /> : <Home />;
}

function AuthFrame({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return (
    <main className="cks-auth-page">
      <div className="cks-auth-layout">
        <div className="cks-auth-top">
          <a
            className="cks-auth-brand"
            href={`${basePath || ''}/`}
            aria-label={t('CKS Crypto Klein Shop home')}
          >
            <img src={`${basePath}/logo.svg`} alt="" />
            <span><strong>CKS</strong> Crypto Klein Shop</span>
          </a>
          <LanguageSwitcher className="cks-auth-language" />
        </div>
        <div className="cks-auth-copy">
          <span className="cks-auth-kicker">CKS Crypto Klein Shop</span>
          <h1>{t('Explore the demo at your own pace.')}</h1>
          <p>{t('Create or access a CKS demo profile. Signing in does not open a real crypto, wallet, or investment account.')}</p>
        </div>
        {children}
        <p className="cks-auth-disclaimer">{t('CKS is a demonstration environment. Balances and actions are illustrative; no real funds or assets are handled.')}</p>
        <a className="cks-auth-home-link" href={`${basePath || ''}/`}>
          {t('Back to the CKS homepage')}
        </a>
      </div>
    </main>
  );
}

function SignInPage() {
  return (
    <AuthFrame>
      <SignIn
        routing="path"
        path={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </AuthFrame>
  );
}

function SignUpPage() {
  return (
    <AuthFrame>
      <SignUp
        routing="path"
        path={`${basePath}/sign-up`}
        signInUrl={`${basePath}/sign-in`}
        forceRedirectUrl={`${basePath}/dashboard`}
      />
    </AuthFrame>
  );
}

function DemoRoutes() {
  const { isLoaded, userId } = useAuth();
  const { t } = useLanguage();

  if (!isLoaded) {
    return <div className="cks-loading" role="status">{t('Loading the CKS demo…')}</div>;
  }

  const storageScope = userId ? `user-${userId}` : 'guest';

  return (
    <DemoProvider key={storageScope} storageScope={storageScope}>
      <Shell>
        <RoutedErrorBoundary>
          <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/markets" component={Markets} />
            <Route path="/trade" component={Trade} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/activity" component={Activity} />
            <Route path="/card" component={CardPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route component={NotFound} />
          </Switch>
        </RoutedErrorBoundary>
      </Shell>
    </DemoProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const currentQueryClient = useQueryClient();
  const previousUserId = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const nextUserId = user?.id ?? null;
      if (
        previousUserId.current !== undefined &&
        previousUserId.current !== nextUserId
      ) {
        currentQueryClient.clear();
      }
      previousUserId.current = nextUserId;
    });
    return unsubscribe;
  }, [addListener, currentQueryClient]);

  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();

  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={language === 'de' ? deDE : enUS}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ClerkQueryClientCacheInvalidator />
          <Switch>
            <Route path="/" component={HomeRoute} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route component={DemoRoutes} />
          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <LanguageProvider>
        <ClerkProviderWithRoutes />
      </LanguageProvider>
    </WouterRouter>
  );
}

export default App;
