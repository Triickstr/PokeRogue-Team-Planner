document.addEventListener("DOMContentLoaded", () => {
  const pokemonData = typeof window.items !== 'undefined' ? window.items : (typeof items !== 'undefined' ? items : []);
  const teamGrid = document.getElementById("teamGrid");

  if (!pokemonData || !Array.isArray(pokemonData) || pokemonData.length === 0) {
    teamGrid.innerHTML = '<p>Failed to load Pokémon data.</p>';
    return;
  }

const getAllMoves = () => {
  const moveSet = new Set();
  pokemonData.forEach(p => {
    const exclude = [p.t1, p.t2, p.a1, p.a2, p.ha, p.pa];
    Object.keys(p).forEach(key => {
      const val = parseInt(key);
      if (!isNaN(val) && !exclude.includes(val)) {
        moveSet.add(val);
      }
    });
  });
  return Array.from(moveSet);
};

  const allMoves = getAllMoves();

  const createPokemonSelector = (onSelect) => {
    const select = document.createElement('select');
    setTimeout(() => new TomSelect(select, { maxOptions: null }), 0);
    select.innerHTML = '<option value="">Select a Pokémon</option>' +
      pokemonData.map((p, i) => {
        const name = window.speciesNames?.[p.row] || `#${p.row} - ${p.img}`;
        return `<option value="${i}">${name}</option>`;
      }).join('');
    select.onchange = () => onSelect(select.value);
    return select;
  };

  const createMoveDropdown = (pokemon) => {
    const sel = document.createElement('select');
    setTimeout(() => new TomSelect(sel, { maxOptions: null }), 0);
    sel.className = 'move-select';
    sel.innerHTML = '<option value="">Select a Move</option>' +
      allMoves.map(m => {
        const isCompatible = String(m) in pokemon;
        const name = window.fidToName?.[m] || `Move ${m}`;
        const opt = `<option value="${m}" class="${isCompatible ? 'move-compatible' : 'move-incompatible'}">${name}</option>`;
        return opt;
      }).join('');
    return sel;
  };

  const createAbilityDropdown = (pokemon) => {
    const abilities = [pokemon.a1, pokemon.a2, pokemon.ha].filter(Boolean);
    const sel = document.createElement('select');
    setTimeout(() => new TomSelect(sel, { maxOptions: null }), 0);
    sel.className = 'ability-select';
    sel.innerHTML = abilities.map(a => {
      const name = window.fidToName?.[a] || `Ability ${a}`;
      return `<option value="${a}">${name}</option>`;
    }).join('');
    return sel;
  };

  const renderPokemonBox = (slot, pokemon) => {
    slot.innerHTML = '';

    const img = document.createElement('img');
    img.src = `images/${pokemon.img}_0.png`;
    img.className = 'pokemon-img';
    img.onerror = () => img.style.display = 'none';
    img.onclick = () => slot.replaceWith(createTeamSlot());
    slot.appendChild(img);

    const stats = document.createElement('div');
    stats.innerText = `HP: ${pokemon.hp}, Atk: ${pokemon.atk}, Def: ${pokemon.def}, SpA: ${pokemon.spa}, SpD: ${pokemon.spd}, Spe: ${pokemon.spe}`;
    slot.appendChild(stats);

    for (let i = 0; i < 4; i++) {
      slot.appendChild(createMoveDropdown(pokemon));
    }

    slot.appendChild(createAbilityDropdown(pokemon));

    const passive = document.createElement('div');
    const passiveName = window.fidToName?.[pokemon.pa] || `Passive ${pokemon.pa}`;
    passive.innerText = `Passive Ability: ${passiveName}`;
    slot.appendChild(passive);
  };

  const createTeamSlot = () => {
    const slot = document.createElement('div');
    slot.className = 'team-slot';
    slot.appendChild(createPokemonSelector((idx) => {
      const pokemon = pokemonData[idx];
      renderPokemonBox(slot, pokemon);
    }));
    return slot;
  };

  for (let i = 0; i < 6; i++) {
    teamGrid.appendChild(createTeamSlot());
  }
});
