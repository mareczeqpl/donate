export class DonationRoom {
  constructor(state, env) { this.state = state; this.env = env; }
  async load() {
    return (await this.state.storage.get("data")) || {users:{}, donations:[], events:[], nextId:1};
  }
  async save(d) {
    // Keep the demo bounded.
    d.donations = d.donations.slice(-200);
    d.events = d.events.slice(-200);
    await this.state.storage.put("data", d);
  }
  async fetch(req) {
    const url = new URL(req.url);
    let d = await this.load();
    const json = (x, status=200) => new Response(JSON.stringify(x), {status, headers:{"content-type":"application/json","cache-control":"no-store"}});
    if (req.method==="GET" && url.pathname==="/api/state") {
      const users = Object.entries(d.users).map(([nick,points])=>({nick,points}));
      return json({users,totalPoints:users.reduce((a,b)=>a+b.points,0),donations:d.donations});
    }
    if (req.method==="GET" && url.pathname==="/api/balance") {
      const nick=(url.searchParams.get("nick")||"").trim();
      return json({points:d.users[nick]||0});
    }
    if (req.method==="GET" && url.pathname==="/api/events") {
      const after=Number(url.searchParams.get("after")||0);
      return json({events:d.events.filter(e=>e.id>after)});
    }
    if (req.method==="POST") {
      let body={}; try { body=await req.json(); } catch { return json({error:"Nieprawidłowy JSON."},400); }
      const nick=String(body.nick||"").trim().slice(0,40), points=Math.floor(Number(body.points)||0), message=String(body.message||"").trim().slice(0,250);
      if (!nick || points<1) return json({error:"Podaj nick i liczbę punktów."},400);
      if (url.pathname==="/api/points") {
        d.users[nick]=(d.users[nick]||0)+points; await this.save(d); return json({balance:d.users[nick]});
      }
      if (url.pathname==="/api/test") {
        const e={id:d.nextId++,nick,points,message:message||"To jest test alertu!"};
        d.events.push(e); await this.save(d); return json({ok:true});
      }
      if (url.pathname==="/api/donate") {
        const balance=d.users[nick]||0;
        if (balance<points) return json({error:`Za mało punktów. Masz ${balance} ✦.`},400);
        d.users[nick]=balance-points;
        const e={id:d.nextId++,nick,points,message:message||"Wysłał wirtualny donat!"};
        d.donations.push({...e,createdAt:Date.now()}); d.events.push(e); await this.save(d);
        return json({ok:true,balance:d.users[nick]});
      }
    }
    return json({error:"Not found"},404);
  }
}

function roomId(env) { return env.ROOM.idFromName("main"); }
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      const id = roomId(env);
      return env.ROOM.get(id).fetch(request);
    }
    // Friendly routes
    if (url.pathname==="/donate" || url.pathname==="/donate/") return env.ASSETS.fetch(new Request(new URL("/donate.html", request.url), request));
    if (url.pathname==="/overlay" || url.pathname==="/overlay/") return env.ASSETS.fetch(new Request(new URL("/overlay.html", request.url), request));
    return env.ASSETS.fetch(request);
  }
};
