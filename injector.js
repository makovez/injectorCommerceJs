const TOKEN = "YOUR SECRET TOKEN HERE. MAKE SURE IT's THE SECRET ONE AND NO PULIC"

let match = "https://dashboard.chec.io/products/"
var container = document.createElement("div"); // define container

elemHtml = '<div class="extra-fields__row-wrapper"><div class="extra-fields__row-input-container"><div class="text-field extra-fields__row-input text-field--inline-label text-field--light" style="display: flex"> <!----> <input type="text" name="metakey" id="metakey" placeholder="Key" required="required" class="text-field__input metakey"> <input type="text" name="matevalue" id="matevalue" placeholder="Value" required="required" class="text-field__input metavalue"></div></div><button id="btn-remove-meta" class="extra-fields__row-btn button button--variant-small button--color-secondary button--has-icon button--has-icon-before" type="button" title="Delete"><i class="button__icon"><svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class=""><path fill-rule="evenodd" clip-rule="evenodd" d="M14 8A6 6 0 112 8a6 6 0 0112 0zm-3.47-2.53a.75.75 0 010 1.06L9.06 8l1.47 1.47a.75.75 0 11-1.06 1.06L8 9.06l-1.47 1.47a.75.75 0 11-1.06-1.06L6.94 8 5.47 6.53a.75.75 0 011.06-1.06L8 6.94l1.47-1.47a.75.75 0 011.06 0z" fill="currentColor"></path></svg></i><span class="button__content"></span></button></div><!---->'


function getCurrentProduct() {
	return window.location.href.split("/products/")[1].split("#")[0]
}



let headers = {
    "X-Authorization": TOKEN,
    "Accept": "application/json",
    "Content-Type": "application/json",
};


function sendGetProduct(prod="prod_L1vOoZR62oRa8Z") {
  
  const url = new URL(
    "https://api.chec.io/v1/products/"+prod
  );

  let params = {
    "type": "id",
  };
  Object.keys(params)
    .forEach(key => url.searchParams.append(key, params[key]));
    
  async function parseProductMeta(json) {
    Object.keys(json.meta).forEach(function(key) {
      elem = addMetaHandler();
      var value = json.meta[key];
      setMetaPairs(elem, key, value)
    });
  }
  
  const getProduct = async () => {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,});
    const json = await response.json();
    await parseProductMeta(json)
  };
  
  getProduct();
}


function sendUpdateProduct(meta = {}, prod="prod_L1vOoZR62oRa8Z") {
  const url = new URL(
    "https://api.chec.io/v1/products/"+prod
  );

  let body = {
    "product": {
      "meta": meta
    }
  }
  
  const updateProduct = async () => {
    const response = await fetch(url, {
      method: "PUT",
      headers: headers,
      body: JSON.stringify(body),
    });
    
    const json = await response.json();
  };
  updateProduct()
}



function listMetas() {
  var json = {};
	elems = container.getElementsByClassName("text-field extra-fields__row-input text-field--inline-label text-field--light")
	elems.forEach((elem) => {
	  key = elem.children[0].value;
	  value = elem.children[1].value;
	  json[key] = value;
	});
	return json
}


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function injectContainer(elem, container) {
	container.className = "card card--border-none";
	container.id = "meta-fields"
	html = '<div class="card__inner-wrapper bg-white p-4 extra-fields"><header class="chec-header chec-header--card"><h3 class="chec-header__title"> Meta fields </h3><div class="chec-header-inner"><!----><button class="button button--variant-round button--color-green" id="add-meta" type="button"><span class="button__content"> Add </span></button></div></header><p class="extra-fields__subtitle"></p><!----></div>';
	container.innerHTML = html;
	insertAfter(elem, container);
}

function setMetaPairs(elem, key, value) {
  	elem.getElementsByClassName("metavalue")[0].value = value
	elem.getElementsByClassName("metakey")[0].value = key
}

function addMetaHandler() {
	let elem = document.createElement("div")
	elem.className = "extra-fields__row"
	elem.innerHTML = elemHtml;
	container.getElementsByClassName("card__inner-wrapper bg-white p-4 extra-fields")[0].appendChild(elem)
	listMetas()
	elem.getElementsByClassName("button")[0].addEventListener("click", removeMetaHandler);
	return elem
} 

function removeMetaHandler(event) {
  event.currentTarget.parentNode.parentNode.remove()
}

function update() {
  if (!prodName) return;
  jsmeta = listMetas()
  sendUpdateProduct(jsmeta, prodName)
}

function addHandlers() {
	document.getElementById("add-meta").addEventListener("click", addMetaHandler);
	document.getElementsByClassName("button button--variant-regular button--color-green")[0].addEventListener("click", update);
}

var prodName;

var interval = setInterval(function() {
  if (!window.location.href.includes(match)) {
  	console.log("bye not in product page")
  	return
  }

  if (prodName && getCurrentProduct() == prodName) {
  	console.log("same product, already done")
  	return 
  }
  
  prodName = getCurrentProduct()
  console.log("new product found " + prodName)

  var go = setInterval(function () {
  	elem = document.getElementById("extra-fields");
  	console.log(elem)
  	if (elem) {
	    injectContainer(elem, container)
	    addHandlers()
	    sendGetProduct(prodName)
	    clearInterval(go)
	    return
  	}
  }, 1000)
  
}, 1000);
