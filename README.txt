VIRTUALDROP — WIRTUALNE DONATY + ALERTY OBS

Ta paczka zawiera gotową stronę widza, panel administratora i overlay do OBS.
System używa Cloudflare Worker + Durable Object, więc panel i OBS komunikują się
przez backend — nie przez localStorage.

STRUKTURA:
- public/index.html  -> panel administratora
- public/donate.html -> strona widza
- public/overlay.html -> overlay do OBS
- worker.js          -> backend/API + Durable Object
- wrangler.toml      -> konfiguracja Cloudflare
- README.txt

URUCHOMIENIE:
1. Wymagany jest Cloudflare Workers z Durable Objects.
2. Najprościej wdrożyć projekt przez Cloudflare dashboard po połączeniu repozytorium
   GitHub albo przez Wrangler zgodnie z dokumentacją Cloudflare.
3. Po wdrożeniu:
   /        = panel
   /donate  = strona widza
   /overlay = adres do OBS Browser Source

OBS:
Browser Source -> https://TWOJ-ADRES/overlay
1920x1080, tło strony pozostaje przezroczyste.

DEMO:
Panel -> "Przyznaj punkty" -> np. Kacper + 500.
Strona /donate -> Kacper -> 100 -> wiadomość -> Wyślij donat.
Alert pojawi się na /overlay i w OBS.

UWAGA:
To są WYŁĄCZNIE wirtualne punkty. Nie ma płatności, PayPala, Stripe ani transferu
prawdziwych pieniędzy.

BEZPIECZEŃSTWO:
To jest gotowy system demonstracyjny. Przed publicznym użyciem warto dodać logowanie
administratora, rate limiting i zabezpieczenie endpointu przyznawania punktów.
