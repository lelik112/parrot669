(function(root){
  const copy={
    en:{name:"Airbnb calendar",loading:"Loading verification status…",required:"Verification required",verified:"✓ Ownership verified",preparing:"Getting the initial calendar snapshot…",ready:"Ready to verify",waiting:"Waiting for the calendar change",failed:"No availability change found",expired:"Verification expired",changed:"Calendar link changed",failedFetch:"Could not complete verification",blocked:"Verification temporarily blocked. Try again later.",start:"Start verification",restart:"Start a new attempt",check:"Check verification",refresh:"Refresh status",intro:"Start verification first. Then choose a suitable period in Airbnb, change its availability and click Check verification.",instructions:"Choose a suitable period in Airbnb, change its availability and click Check verification. Either blocking or reopening dates works.",retries:"We check now, then automatically after 5, 10 and 20 minutes. You can close this page.",scope:"This confirms control of the calendar source, not identity or property ownership.",disabled:"Calendar disabled. Enable it to verify.",unavailable:"Could not load verification status. Please retry.",fetchError:"Airbnb's calendar is temporarily unavailable. We will retry automatically.",invalid:"Airbnb returned an incomplete calendar. We will retry automatically.",signIn:"Log in again to verify the calendar.",attempt:(n,max)=>`Attempt ${n} of ${max}`,deadline:v=>`Make the change and check by ${v}.`,next:v=>`Next automatic check: ${v}`,until:v=>`You can start again after ${v}.`,verifiedAt:v=>`Verified: ${v}`},
    es:{name:"Calendario de Airbnb",loading:"Cargando estado de verificación…",required:"Verificación pendiente",verified:"✓ Control del calendario verificado",preparing:"Obteniendo el estado inicial del calendario…",ready:"Listo para verificar",waiting:"Esperando el cambio del calendario",failed:"No se detectaron cambios de disponibilidad",expired:"La verificación ha caducado",changed:"El enlace del calendario ha cambiado",failedFetch:"No se pudo completar la verificación",blocked:"Verificación bloqueada temporalmente. Inténtalo más tarde.",start:"Iniciar verificación",restart:"Iniciar otro intento",check:"Comprobar verificación",refresh:"Actualizar estado",intro:"Inicia la verificación. Después elige un período adecuado en Airbnb, cambia su disponibilidad y pulsa Comprobar verificación.",instructions:"Elige un período adecuado en Airbnb, cambia su disponibilidad y pulsa Comprobar verificación. Puedes bloquear o volver a abrir fechas.",retries:"Comprobamos ahora y automáticamente a los 5, 10 y 20 minutos. Puedes cerrar esta página.",scope:"Esto confirma el control del calendario, no la identidad ni la propiedad de la vivienda.",disabled:"Calendario desactivado. Actívalo para verificarlo.",unavailable:"No se pudo cargar el estado. Inténtalo de nuevo.",fetchError:"El calendario de Airbnb no está disponible temporalmente. Reintentaremos automáticamente.",invalid:"Airbnb devolvió un calendario incompleto. Reintentaremos automáticamente.",signIn:"Vuelve a iniciar sesión para verificar el calendario.",attempt:(n,max)=>`Intento ${n} de ${max}`,deadline:v=>`Cambia las fechas y comprueba antes de ${v}.`,next:v=>`Próxima comprobación automática: ${v}`,until:v=>`Puedes volver a empezar después de ${v}.`,verifiedAt:v=>`Verificado: ${v}`},
    ca:{name:"Calendari d’Airbnb",loading:"Carregant l’estat de verificació…",required:"Cal verificar el calendari",verified:"✓ Control del calendari verificat",preparing:"Obtenint l’estat inicial del calendari…",ready:"A punt per verificar",waiting:"Esperant el canvi del calendari",failed:"No s’han detectat canvis de disponibilitat",expired:"La verificació ha caducat",changed:"L’enllaç del calendari ha canviat",failedFetch:"No s’ha pogut completar la verificació",blocked:"Verificació bloquejada temporalment. Torna-ho a provar més tard.",start:"Iniciar verificació",restart:"Iniciar un altre intent",check:"Comprovar verificació",refresh:"Actualitzar estat",intro:"Inicia la verificació. Després tria un període adequat a Airbnb, canvia’n la disponibilitat i prem Comprovar verificació.",instructions:"Tria un període adequat a Airbnb, canvia’n la disponibilitat i prem Comprovar verificació. Pots bloquejar o tornar a obrir dates.",retries:"Comprovem ara i automàticament als 5, 10 i 20 minuts. Pots tancar aquesta pàgina.",scope:"Això confirma el control del calendari, no la identitat ni la propietat de l’habitatge.",disabled:"Calendari desactivat. Activa’l per verificar-lo.",unavailable:"No s’ha pogut carregar l’estat. Torna-ho a provar.",fetchError:"El calendari d’Airbnb no està disponible temporalment. Ho tornarem a provar automàticament.",invalid:"Airbnb ha retornat un calendari incomplet. Ho tornarem a provar automàticament.",signIn:"Torna a iniciar sessió per verificar el calendari.",attempt:(n,max)=>`Intent ${n} de ${max}`,deadline:v=>`Canvia les dates i comprova abans de ${v}.`,next:v=>`Propera comprovació automàtica: ${v}`,until:v=>`Pots tornar a començar després de ${v}.`,verifiedAt:v=>`Verificat: ${v}`},
    ru:{name:"Календарь Airbnb",loading:"Загружаем статус проверки…",required:"Требуется проверка",verified:"✓ Управление календарём подтверждено",preparing:"Получаем исходное состояние календаря…",ready:"Можно проверять",waiting:"Ожидаем изменения календаря",failed:"Изменений доступности не найдено",expired:"Время проверки истекло",changed:"Ссылка календаря изменилась",failedFetch:"Не удалось завершить проверку",blocked:"Проверка временно заблокирована. Попробуйте позже.",start:"Начать проверку",restart:"Начать новую попытку",check:"Проверить",refresh:"Обновить статус",intro:"Сначала начните проверку. Затем выберите подходящий период в Airbnb, измените его доступность и нажмите «Проверить».",instructions:"Выберите подходящий период в Airbnb, измените его доступность и нажмите «Проверить». Можно как закрыть, так и открыть даты.",retries:"Проверим сразу, затем автоматически через 5, 10 и 20 минут. Страницу можно закрыть.",scope:"Подтверждается управление календарём. Личность и право собственности на жильё не проверяются.",disabled:"Календарь выключен. Включите его для проверки.",unavailable:"Не удалось загрузить статус проверки. Попробуйте ещё раз.",fetchError:"Календарь Airbnb временно недоступен. Повторим запрос автоматически.",invalid:"Airbnb вернул неполный календарь. Повторим запрос автоматически.",signIn:"Войдите снова, чтобы проверить календарь.",attempt:(n,max)=>`Попытка ${n} из ${max}`,deadline:v=>`Измените даты и нажмите «Проверить» до ${v}.`,next:v=>`Следующая автоматическая проверка: ${v}`,until:v=>`Новая попытка будет доступна после ${v}.`,verifiedAt:v=>`Подтверждено: ${v}`}
  };
  function create({calendar,request,language="en",onUnauthorized=()=>{},onStatus=()=>{}}){
    const tr=copy[language]||copy.en;
    const node=document.createElement("section");node.className="calendar-verification";node.setAttribute("aria-live","polite");
    const title=document.createElement("strong"),detail=document.createElement("p"),timing=document.createElement("p"),attempt=document.createElement("p");
    const notice=document.createElement("p");notice.className="calendar-verification-error";notice.setAttribute("role","alert");
    const button=document.createElement("button");button.type="button";button.className="button button-small";
    const scope=document.createElement("p");scope.className="calendar-verification-scope";scope.textContent=tr.scope;
    node.append(title,detail,timing,attempt,notice,button,scope);
    let value=null,error="",busy=false,disposed=false,timer,controller,action="refresh";
    const text=(element,value)=>{if(element.textContent!==value)element.textContent=value;element.hidden=!value;};
    function date(value){
      const parsed=new Date(value);
      return Number.isFinite(parsed.getTime())?parsed.toLocaleString(language,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}):"";
    }
    function render(){
      const state=value?.status;
      node.dataset.status=state||"loading";
      let heading=tr.loading,description="",time="";
      action="refresh";
      button.hidden=!error;
      button.textContent=tr.refresh;
      if(value){
        if(state==="verified"){
          heading=tr.verified;time=value.verifiedAt?tr.verifiedAt(date(value.verifiedAt)):"";
        }else if(state==="blocked"){
          heading=tr.blocked;time=value.blockedUntil?tr.until(date(value.blockedUntil)):"";
        }else if(state==="pending"){
          heading=!value.baselineReady?tr.preparing:value.canCheck?tr.ready:tr.waiting;
          description=value.canCheck?tr.instructions:value.baselineReady?tr.retries:"";
          if(value.nextCheckAt)time=tr.next(date(value.nextCheckAt));
          else if(value.canCheck && value.expiresAt)time=tr.deadline(date(value.expiresAt));
        }else{
          heading=state==="failed"?(value.lastError==="expired"?tr.expired:value.lastError==="source_changed"?tr.changed:
            ["fetch_failed","invalid_calendar"].includes(value.lastError)?tr.failedFetch:tr.failed):tr.required;
          description=tr.intro;
        }
        if(calendar.enabled===false)description=tr.disabled;
        if(value.canStart && calendar.enabled!==false){action="start";button.textContent=state==="failed"?tr.restart:tr.start;button.hidden=false;}
        if(value.canCheck && calendar.enabled!==false){action="check";button.textContent=tr.check;button.hidden=false;}
        if(state==="pending" && !error){
          if(value.lastError==="fetch_failed")description=tr.fetchError;
          if(value.lastError==="invalid_calendar")description=tr.invalid;
        }
      }
      text(title,heading);text(detail,description);text(timing,time);
      if(error){action="refresh";button.hidden=false;button.textContent=tr.refresh;}
      text(attempt,value?.attemptsCount && state!=="verified"?tr.attempt(value.attemptsCount,value.maxAttempts):"");
      text(notice,error);button.disabled=busy;node.setAttribute("aria-busy",String(busy));
      if(value)onStatus(value);
    }
    function schedule(){
      clearTimeout(timer);
      if(disposed || document.visibilityState==="hidden")return;
      if(value?.status==="pending" || error)timer=setTimeout(()=>load(),error?30000:15000);
      else if(value?.status==="blocked" && value.blockedUntil){
        timer=setTimeout(()=>load(),Math.max(1000,new Date(value.blockedUntil).getTime()-Date.now()+1000));
      }
    }
    async function load(operation="refresh"){
      if(disposed || busy)return;
      busy=true;error="";clearTimeout(timer);render();controller=new AbortController();
      try{
        const path=`/calendars/${encodeURIComponent(calendar.id)}/verification`;
        value=await request(path+(operation==="refresh"?"":"/"+operation),{method:operation==="refresh"?"GET":"POST",signal:controller.signal});
        if(disposed)return;
      }catch(err){
        if(disposed || err.name==="AbortError")return;
        error=err.status===401?tr.signIn:tr.unavailable;
        if(err.status===401){dispose();onUnauthorized();return;}
        // Another tab can have started the check or exhausted the last attempt.
        if(operation!=="refresh" && [409,429].includes(err.status)){
          try{value=await request(`/calendars/${encodeURIComponent(calendar.id)}/verification`,{signal:controller.signal});error="";}catch{}
        }
      }finally{
        busy=false;if(!disposed){render();schedule();}
      }
    }
    button.addEventListener("click",()=>load(action));
    function visible(){if(document.visibilityState!=="hidden")void load();else clearTimeout(timer);}
    document.addEventListener("visibilitychange",visible);
    function dispose(){disposed=true;clearTimeout(timer);controller?.abort();document.removeEventListener("visibilitychange",visible);}
    render();void load();
    return {node,name:tr.name,dispose};
  }
  root.ParrotCalendarVerification={create};
})(window);
