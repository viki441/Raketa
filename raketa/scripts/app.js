async function loadSchema() {
    const response = await fetch("json/shema.json");
    const schema = await response.json();

    const form = document.getElementById("form");

    for (const key in schema) {
        const field = schema[key];
        const div = renderField(key, field);
        form.appendChild(div);
    }

    const submit = document.createElement("button");
    submit.id = "submit";
    submit.type = "submit";
    submit.textContent = "Submit";
    form.appendChild(submit);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {};
        new FormData(form).forEach((value, key) => {
            const path = key.split(".");
            
            let ref = data;
            while (path.length > 1) {
                const part = path.shift();
                ref[part] = ref[part] || {};
                ref = ref[part];
            }
            ref[path[0]] = value;
        });
        alert("Submitted:\n" + JSON.stringify(data, null, 2));
    });

}

function renderField(name, field, path = []) {
    const wrapper = document.createElement("div");
    wrapper.className = "form-field";

    const fullPath = [...path, name]
  .map((segment, index) => (index === 0 ? segment : `[${segment}]`))
  .join('');

    const label = document.createElement("label");

    if(name !== "address")
    {
        label.textContent = field.label || name;
        label.htmlFor = fullPath;
        wrapper.appendChild(label);
    }
    
    
    

    let input;

    switch (field.type) {
        case "text":
        case "date":
        case "email":
        case "number":
            input = document.createElement("input");
            input.type = field.type;
            break;
        case "textarea":
            input = document.createElement("textarea");
            break;
        case "select":
            input = document.createElement("select");

            if (field.type) {
                const options = document.createElement("option");
                options.disabled = true;
                options.selected = true;
                options.hidden = true;
                options.textContent = field.placeholder;
                input.appendChild(options);
            }
            field.options.forEach(([val, label]) => {
                const option = document.createElement("option");
                option.value = val;
                option.textContent = label;
                input.appendChild(option);
            });
            break;
        case "schema":
            wrapper.innerHTML += `<fieldset><legend>${field.label || name}</legend></fieldset>`;
            const fieldset = wrapper.querySelector("fieldset");
            for (const subkey in field.schema) {
                const subfield = field.schema[subkey];
                const subDiv = renderField(subkey, subfield, [...path, name]);
                fieldset.appendChild(subDiv);
            }
            return wrapper;
        default:
            input = document.createElement("input");
            input.type = "text";
    }

    input.name = fullPath;
    input.id = fullPath;

    if (field.pattern) input.pattern = field.pattern;
    wrapper.appendChild(input);

    if (field.hint) {
        const hint = document.createElement("div");
        hint.className = "hint";
        hint.textContent = field.hint;
        wrapper.appendChild(hint);
    }

    return wrapper;
}

loadSchema();
