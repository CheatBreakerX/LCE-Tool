
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }
    function split_css_unit(value) {
        const split = typeof value === 'string' && value.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);
        return split ? [parseFloat(split[1]), split[2] || 'px'] : [value, 'px'];
    }
    const contenteditable_truthy_values = ['', true, 1, 'true', 'contenteditable'];

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function self(fn) {
        return function (event) {
            // @ts-ignore
            if (event.target === this)
                fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    /**
     * List of attributes that should always be set through the attr method,
     * because updating them through the property setter doesn't work reliably.
     * In the example of `width`/`height`, the problem is that the setter only
     * accepts numeric values, but the attribute can also be set to a string like `50%`.
     * If this list becomes too big, rethink this approach.
     */
    const always_set_through_set_attribute = ['width', 'height'];
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set && always_set_through_set_attribute.indexOf(key) === -1) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function set_svg_attributes(node, attributes) {
        for (const key in attributes) {
            attr(node, key, attributes[key]);
        }
    }
    function set_custom_element_data_map(node, data_map) {
        Object.keys(data_map).forEach((key) => {
            set_custom_element_data(node, key, data_map[key]);
        });
    }
    function set_custom_element_data(node, prop, value) {
        if (prop in node) {
            node[prop] = typeof node[prop] === 'boolean' && value === '' ? true : value;
        }
        else {
            attr(node, prop, value);
        }
    }
    function set_dynamic_element_data(tag) {
        return (/-/.test(tag)) ? set_custom_element_data_map : set_attributes;
    }
    function get_binding_group_value(group, __value, checked) {
        const value = new Set();
        for (let i = 0; i < group.length; i += 1) {
            if (group[i].checked)
                value.add(group[i].__value);
        }
        if (!checked) {
            value.delete(__value);
        }
        return Array.from(value);
    }
    function init_binding_group(group) {
        let _inputs;
        return {
            /* push */ p(...inputs) {
                _inputs = inputs;
                _inputs.forEach(input => group.push(input));
            },
            /* remove */ r() {
                _inputs.forEach(input => group.splice(group.indexOf(input), 1));
            }
        };
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_iframe_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
                // make sure an initial resize event is fired _after_ the iframe is loaded (which is asynchronous)
                // see https://github.com/sveltejs/svelte/issues/4233
                fn();
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
        };
    }
    /**
     * Associates an arbitrary `context` object with the current component and the specified `key`
     * and returns that object. The context is then available to children of the component
     * (including slotted content) with `getContext`.
     *
     * Like lifecycle functions, this must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-setcontext
     */
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
        return context;
    }
    /**
     * Retrieves the context that belongs to the closest parent component with the specified `key`.
     * Must be called during component initialisation.
     *
     * https://svelte.dev/docs#run-time-svelte-getcontext
     */
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        const options = { direction: 'in' };
        let config = fn(node, params, options);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config(options);
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        const options = { direction: 'out' };
        let config = fn(node, params, options);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config(options);
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config(options);
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        const updates = [];
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                // defer updates until all the DOM shuffling is done
                updates.push(() => block.p(child_ctx, dirty));
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        run_all(updates);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    /** regex of all html void element names */
    const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    function is_void(name) {
        return void_element_names.test(name) || name.toLowerCase() === '!doctype';
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function set_data_contenteditable_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function set_data_maybe_contenteditable_dev(text, data, attr_value) {
        if (~contenteditable_truthy_values.indexOf(attr_value)) {
            set_data_contenteditable_dev(text, data);
        }
        else {
            set_data_dev(text, data);
        }
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    function validate_dynamic_element(tag) {
        const is_string = typeof tag === 'string';
        if (tag && !is_string) {
            throw new Error('<svelte:element> expects "this" attribute to be a string.');
        }
    }
    function validate_void_dynamic_element(tag) {
        if (tag && is_void(tag)) {
            console.warn(`<svelte:element this="${tag}"> is self-closing and cannot have content.`);
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*!
    * tabbable 5.3.3
    * @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
    */
    var candidateSelectors = ['input', 'select', 'textarea', 'a[href]', 'button', '[tabindex]:not(slot)', 'audio[controls]', 'video[controls]', '[contenteditable]:not([contenteditable="false"])', 'details>summary:first-of-type', 'details'];
    var candidateSelector = /* #__PURE__ */candidateSelectors.join(',');
    var NoElement = typeof Element === 'undefined';
    var matches = NoElement ? function () {} : Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    var getRootNode = !NoElement && Element.prototype.getRootNode ? function (element) {
      return element.getRootNode();
    } : function (element) {
      return element.ownerDocument;
    };
    /**
     * @param {Element} el container to check in
     * @param {boolean} includeContainer add container to check
     * @param {(node: Element) => boolean} filter filter candidates
     * @returns {Element[]}
     */

    var getCandidates = function getCandidates(el, includeContainer, filter) {
      var candidates = Array.prototype.slice.apply(el.querySelectorAll(candidateSelector));

      if (includeContainer && matches.call(el, candidateSelector)) {
        candidates.unshift(el);
      }

      candidates = candidates.filter(filter);
      return candidates;
    };
    /**
     * @callback GetShadowRoot
     * @param {Element} element to check for shadow root
     * @returns {ShadowRoot|boolean} ShadowRoot if available or boolean indicating if a shadowRoot is attached but not available.
     */

    /**
     * @callback ShadowRootFilter
     * @param {Element} shadowHostNode the element which contains shadow content
     * @returns {boolean} true if a shadow root could potentially contain valid candidates.
     */

    /**
     * @typedef {Object} CandidatesScope
     * @property {Element} scope contains inner candidates
     * @property {Element[]} candidates
     */

    /**
     * @typedef {Object} IterativeOptions
     * @property {GetShadowRoot|boolean} getShadowRoot true if shadow support is enabled; falsy if not;
     *  if a function, implies shadow support is enabled and either returns the shadow root of an element
     *  or a boolean stating if it has an undisclosed shadow root
     * @property {(node: Element) => boolean} filter filter candidates
     * @property {boolean} flatten if true then result will flatten any CandidatesScope into the returned list
     * @property {ShadowRootFilter} shadowRootFilter filter shadow roots;
     */

    /**
     * @param {Element[]} elements list of element containers to match candidates from
     * @param {boolean} includeContainer add container list to check
     * @param {IterativeOptions} options
     * @returns {Array.<Element|CandidatesScope>}
     */


    var getCandidatesIteratively = function getCandidatesIteratively(elements, includeContainer, options) {
      var candidates = [];
      var elementsToCheck = Array.from(elements);

      while (elementsToCheck.length) {
        var element = elementsToCheck.shift();

        if (element.tagName === 'SLOT') {
          // add shadow dom slot scope (slot itself cannot be focusable)
          var assigned = element.assignedElements();
          var content = assigned.length ? assigned : element.children;
          var nestedCandidates = getCandidatesIteratively(content, true, options);

          if (options.flatten) {
            candidates.push.apply(candidates, nestedCandidates);
          } else {
            candidates.push({
              scope: element,
              candidates: nestedCandidates
            });
          }
        } else {
          // check candidate element
          var validCandidate = matches.call(element, candidateSelector);

          if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element))) {
            candidates.push(element);
          } // iterate over shadow content if possible


          var shadowRoot = element.shadowRoot || // check for an undisclosed shadow
          typeof options.getShadowRoot === 'function' && options.getShadowRoot(element);
          var validShadowRoot = !options.shadowRootFilter || options.shadowRootFilter(element);

          if (shadowRoot && validShadowRoot) {
            // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
            //  shadow exists, so look at light dom children as fallback BUT create a scope for any
            //  child candidates found because they're likely slotted elements (elements that are
            //  children of the web component element (which has the shadow), in the light dom, but
            //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
            //  _after_ we return from this recursive call
            var _nestedCandidates = getCandidatesIteratively(shadowRoot === true ? element.children : shadowRoot.children, true, options);

            if (options.flatten) {
              candidates.push.apply(candidates, _nestedCandidates);
            } else {
              candidates.push({
                scope: element,
                candidates: _nestedCandidates
              });
            }
          } else {
            // there's not shadow so just dig into the element's (light dom) children
            //  __without__ giving the element special scope treatment
            elementsToCheck.unshift.apply(elementsToCheck, element.children);
          }
        }
      }

      return candidates;
    };

    var getTabindex = function getTabindex(node, isScope) {
      if (node.tabIndex < 0) {
        // in Chrome, <details/>, <audio controls/> and <video controls/> elements get a default
        // `tabIndex` of -1 when the 'tabindex' attribute isn't specified in the DOM,
        // yet they are still part of the regular tab order; in FF, they get a default
        // `tabIndex` of 0; since Chrome still puts those elements in the regular tab
        // order, consider their tab index to be 0.
        // Also browsers do not return `tabIndex` correctly for contentEditable nodes;
        // so if they don't have a tabindex attribute specifically set, assume it's 0.
        //
        // isScope is positive for custom element with shadow root or slot that by default
        // have tabIndex -1, but need to be sorted by document order in order for their
        // content to be inserted in the correct position
        if ((isScope || /^(AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || node.isContentEditable) && isNaN(parseInt(node.getAttribute('tabindex'), 10))) {
          return 0;
        }
      }

      return node.tabIndex;
    };

    var sortOrderedTabbables = function sortOrderedTabbables(a, b) {
      return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex;
    };

    var isInput = function isInput(node) {
      return node.tagName === 'INPUT';
    };

    var isHiddenInput = function isHiddenInput(node) {
      return isInput(node) && node.type === 'hidden';
    };

    var isDetailsWithSummary = function isDetailsWithSummary(node) {
      var r = node.tagName === 'DETAILS' && Array.prototype.slice.apply(node.children).some(function (child) {
        return child.tagName === 'SUMMARY';
      });
      return r;
    };

    var getCheckedRadio = function getCheckedRadio(nodes, form) {
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].checked && nodes[i].form === form) {
          return nodes[i];
        }
      }
    };

    var isTabbableRadio = function isTabbableRadio(node) {
      if (!node.name) {
        return true;
      }

      var radioScope = node.form || getRootNode(node);

      var queryRadios = function queryRadios(name) {
        return radioScope.querySelectorAll('input[type="radio"][name="' + name + '"]');
      };

      var radioSet;

      if (typeof window !== 'undefined' && typeof window.CSS !== 'undefined' && typeof window.CSS.escape === 'function') {
        radioSet = queryRadios(window.CSS.escape(node.name));
      } else {
        try {
          radioSet = queryRadios(node.name);
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error('Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s', err.message);
          return false;
        }
      }

      var checked = getCheckedRadio(radioSet, node.form);
      return !checked || checked === node;
    };

    var isRadio = function isRadio(node) {
      return isInput(node) && node.type === 'radio';
    };

    var isNonTabbableRadio = function isNonTabbableRadio(node) {
      return isRadio(node) && !isTabbableRadio(node);
    };

    var isZeroArea = function isZeroArea(node) {
      var _node$getBoundingClie = node.getBoundingClientRect(),
          width = _node$getBoundingClie.width,
          height = _node$getBoundingClie.height;

      return width === 0 && height === 0;
    };

    var isHidden = function isHidden(node, _ref) {
      var displayCheck = _ref.displayCheck,
          getShadowRoot = _ref.getShadowRoot;

      // NOTE: visibility will be `undefined` if node is detached from the document
      //  (see notes about this further down), which means we will consider it visible
      //  (this is legacy behavior from a very long way back)
      // NOTE: we check this regardless of `displayCheck="none"` because this is a
      //  _visibility_ check, not a _display_ check
      if (getComputedStyle(node).visibility === 'hidden') {
        return true;
      }

      var isDirectSummary = matches.call(node, 'details>summary:first-of-type');
      var nodeUnderDetails = isDirectSummary ? node.parentElement : node;

      if (matches.call(nodeUnderDetails, 'details:not([open]) *')) {
        return true;
      } // The root node is the shadow root if the node is in a shadow DOM; some document otherwise
      //  (but NOT _the_ document; see second 'If' comment below for more).
      // If rootNode is shadow root, it'll have a host, which is the element to which the shadow
      //  is attached, and the one we need to check if it's in the document or not (because the
      //  shadow, and all nodes it contains, is never considered in the document since shadows
      //  behave like self-contained DOMs; but if the shadow's HOST, which is part of the document,
      //  is hidden, or is not in the document itself but is detached, it will affect the shadow's
      //  visibility, including all the nodes it contains). The host could be any normal node,
      //  or a custom element (i.e. web component). Either way, that's the one that is considered
      //  part of the document, not the shadow root, nor any of its children (i.e. the node being
      //  tested).
      // If rootNode is not a shadow root, it won't have a host, and so rootNode should be the
      //  document (per the docs) and while it's a Document-type object, that document does not
      //  appear to be the same as the node's `ownerDocument` for some reason, so it's safer
      //  to ignore the rootNode at this point, and use `node.ownerDocument`. Otherwise,
      //  using `rootNode.contains(node)` will _always_ be true we'll get false-positives when
      //  node is actually detached.


      var nodeRootHost = getRootNode(node).host;
      var nodeIsAttached = (nodeRootHost === null || nodeRootHost === void 0 ? void 0 : nodeRootHost.ownerDocument.contains(nodeRootHost)) || node.ownerDocument.contains(node);

      if (!displayCheck || displayCheck === 'full') {
        if (typeof getShadowRoot === 'function') {
          // figure out if we should consider the node to be in an undisclosed shadow and use the
          //  'non-zero-area' fallback
          var originalNode = node;

          while (node) {
            var parentElement = node.parentElement;
            var rootNode = getRootNode(node);

            if (parentElement && !parentElement.shadowRoot && getShadowRoot(parentElement) === true // check if there's an undisclosed shadow
            ) {
              // node has an undisclosed shadow which means we can only treat it as a black box, so we
              //  fall back to a non-zero-area test
              return isZeroArea(node);
            } else if (node.assignedSlot) {
              // iterate up slot
              node = node.assignedSlot;
            } else if (!parentElement && rootNode !== node.ownerDocument) {
              // cross shadow boundary
              node = rootNode.host;
            } else {
              // iterate up normal dom
              node = parentElement;
            }
          }

          node = originalNode;
        } // else, `getShadowRoot` might be true, but all that does is enable shadow DOM support
        //  (i.e. it does not also presume that all nodes might have undisclosed shadows); or
        //  it might be a falsy value, which means shadow DOM support is disabled
        // Since we didn't find it sitting in an undisclosed shadow (or shadows are disabled)
        //  now we can just test to see if it would normally be visible or not, provided it's
        //  attached to the main document.
        // NOTE: We must consider case where node is inside a shadow DOM and given directly to
        //  `isTabbable()` or `isFocusable()` -- regardless of `getShadowRoot` option setting.


        if (nodeIsAttached) {
          // this works wherever the node is: if there's at least one client rect, it's
          //  somehow displayed; it also covers the CSS 'display: contents' case where the
          //  node itself is hidden in place of its contents; and there's no need to search
          //  up the hierarchy either
          return !node.getClientRects().length;
        } // Else, the node isn't attached to the document, which means the `getClientRects()`
        //  API will __always__ return zero rects (this can happen, for example, if React
        //  is used to render nodes onto a detached tree, as confirmed in this thread:
        //  https://github.com/facebook/react/issues/9117#issuecomment-284228870)
        //
        // It also means that even window.getComputedStyle(node).display will return `undefined`
        //  because styles are only computed for nodes that are in the document.
        //
        // NOTE: THIS HAS BEEN THE CASE FOR YEARS. It is not new, nor is it caused by tabbable
        //  somehow. Though it was never stated officially, anyone who has ever used tabbable
        //  APIs on nodes in detached containers has actually implicitly used tabbable in what
        //  was later (as of v5.2.0 on Apr 9, 2021) called `displayCheck="none"` mode -- essentially
        //  considering __everything__ to be visible because of the innability to determine styles.

      } else if (displayCheck === 'non-zero-area') {
        // NOTE: Even though this tests that the node's client rect is non-zero to determine
        //  whether it's displayed, and that a detached node will __always__ have a zero-area
        //  client rect, we don't special-case for whether the node is attached or not. In
        //  this mode, we do want to consider nodes that have a zero area to be hidden at all
        //  times, and that includes attached or not.
        return isZeroArea(node);
      } // visible, as far as we can tell, or per current `displayCheck` mode


      return false;
    }; // form fields (nested) inside a disabled fieldset are not focusable/tabbable
    //  unless they are in the _first_ <legend> element of the top-most disabled
    //  fieldset


    var isDisabledFromFieldset = function isDisabledFromFieldset(node) {
      if (/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
        var parentNode = node.parentElement; // check if `node` is contained in a disabled <fieldset>

        while (parentNode) {
          if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
            // look for the first <legend> among the children of the disabled <fieldset>
            for (var i = 0; i < parentNode.children.length; i++) {
              var child = parentNode.children.item(i); // when the first <legend> (in document order) is found

              if (child.tagName === 'LEGEND') {
                // if its parent <fieldset> is not nested in another disabled <fieldset>,
                // return whether `node` is a descendant of its first <legend>
                return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node);
              }
            } // the disabled <fieldset> containing `node` has no <legend>


            return true;
          }

          parentNode = parentNode.parentElement;
        }
      } // else, node's tabbable/focusable state should not be affected by a fieldset's
      //  enabled/disabled state


      return false;
    };

    var isNodeMatchingSelectorFocusable = function isNodeMatchingSelectorFocusable(options, node) {
      if (node.disabled || isHiddenInput(node) || isHidden(node, options) || // For a details element with a summary, the summary element gets the focus
      isDetailsWithSummary(node) || isDisabledFromFieldset(node)) {
        return false;
      }

      return true;
    };

    var isNodeMatchingSelectorTabbable = function isNodeMatchingSelectorTabbable(options, node) {
      if (isNonTabbableRadio(node) || getTabindex(node) < 0 || !isNodeMatchingSelectorFocusable(options, node)) {
        return false;
      }

      return true;
    };

    var isValidShadowRootTabbable = function isValidShadowRootTabbable(shadowHostNode) {
      var tabIndex = parseInt(shadowHostNode.getAttribute('tabindex'), 10);

      if (isNaN(tabIndex) || tabIndex >= 0) {
        return true;
      } // If a custom element has an explicit negative tabindex,
      // browsers will not allow tab targeting said element's children.


      return false;
    };
    /**
     * @param {Array.<Element|CandidatesScope>} candidates
     * @returns Element[]
     */


    var sortByOrder = function sortByOrder(candidates) {
      var regularTabbables = [];
      var orderedTabbables = [];
      candidates.forEach(function (item, i) {
        var isScope = !!item.scope;
        var element = isScope ? item.scope : item;
        var candidateTabindex = getTabindex(element, isScope);
        var elements = isScope ? sortByOrder(item.candidates) : element;

        if (candidateTabindex === 0) {
          isScope ? regularTabbables.push.apply(regularTabbables, elements) : regularTabbables.push(element);
        } else {
          orderedTabbables.push({
            documentOrder: i,
            tabIndex: candidateTabindex,
            item: item,
            isScope: isScope,
            content: elements
          });
        }
      });
      return orderedTabbables.sort(sortOrderedTabbables).reduce(function (acc, sortable) {
        sortable.isScope ? acc.push.apply(acc, sortable.content) : acc.push(sortable.content);
        return acc;
      }, []).concat(regularTabbables);
    };

    var tabbable = function tabbable(el, options) {
      options = options || {};
      var candidates;

      if (options.getShadowRoot) {
        candidates = getCandidatesIteratively([el], options.includeContainer, {
          filter: isNodeMatchingSelectorTabbable.bind(null, options),
          flatten: false,
          getShadowRoot: options.getShadowRoot,
          shadowRootFilter: isValidShadowRootTabbable
        });
      } else {
        candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorTabbable.bind(null, options));
      }

      return sortByOrder(candidates);
    };

    var focusable = function focusable(el, options) {
      options = options || {};
      var candidates;

      if (options.getShadowRoot) {
        candidates = getCandidatesIteratively([el], options.includeContainer, {
          filter: isNodeMatchingSelectorFocusable.bind(null, options),
          flatten: true,
          getShadowRoot: options.getShadowRoot
        });
      } else {
        candidates = getCandidates(el, options.includeContainer, isNodeMatchingSelectorFocusable.bind(null, options));
      }

      return candidates;
    };

    var isTabbable = function isTabbable(node, options) {
      options = options || {};

      if (!node) {
        throw new Error('No node provided');
      }

      if (matches.call(node, candidateSelector) === false) {
        return false;
      }

      return isNodeMatchingSelectorTabbable(options, node);
    };

    var focusableCandidateSelector = /* #__PURE__ */candidateSelectors.concat('iframe').join(',');

    var isFocusable = function isFocusable(node, options) {
      options = options || {};

      if (!node) {
        throw new Error('No node provided');
      }

      if (matches.call(node, focusableCandidateSelector) === false) {
        return false;
      }

      return isNodeMatchingSelectorFocusable(options, node);
    };

    /*!
    * focus-trap 6.9.4
    * @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
    */

    function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);

      if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
      }

      return keys;
    }

    function _objectSpread2(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }

      return target;
    }

    function _defineProperty(obj, key, value) {
      if (key in obj) {
        Object.defineProperty(obj, key, {
          value: value,
          enumerable: true,
          configurable: true,
          writable: true
        });
      } else {
        obj[key] = value;
      }

      return obj;
    }

    var activeFocusTraps = function () {
      var trapQueue = [];
      return {
        activateTrap: function activateTrap(trap) {
          if (trapQueue.length > 0) {
            var activeTrap = trapQueue[trapQueue.length - 1];

            if (activeTrap !== trap) {
              activeTrap.pause();
            }
          }

          var trapIndex = trapQueue.indexOf(trap);

          if (trapIndex === -1) {
            trapQueue.push(trap);
          } else {
            // move this existing trap to the front of the queue
            trapQueue.splice(trapIndex, 1);
            trapQueue.push(trap);
          }
        },
        deactivateTrap: function deactivateTrap(trap) {
          var trapIndex = trapQueue.indexOf(trap);

          if (trapIndex !== -1) {
            trapQueue.splice(trapIndex, 1);
          }

          if (trapQueue.length > 0) {
            trapQueue[trapQueue.length - 1].unpause();
          }
        }
      };
    }();

    var isSelectableInput = function isSelectableInput(node) {
      return node.tagName && node.tagName.toLowerCase() === 'input' && typeof node.select === 'function';
    };

    var isEscapeEvent = function isEscapeEvent(e) {
      return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
    };

    var isTabEvent = function isTabEvent(e) {
      return e.key === 'Tab' || e.keyCode === 9;
    };

    var delay = function delay(fn) {
      return setTimeout(fn, 0);
    }; // Array.find/findIndex() are not supported on IE; this replicates enough
    //  of Array.findIndex() for our needs


    var findIndex = function findIndex(arr, fn) {
      var idx = -1;
      arr.every(function (value, i) {
        if (fn(value)) {
          idx = i;
          return false; // break
        }

        return true; // next
      });
      return idx;
    };
    /**
     * Get an option's value when it could be a plain value, or a handler that provides
     *  the value.
     * @param {*} value Option's value to check.
     * @param {...*} [params] Any parameters to pass to the handler, if `value` is a function.
     * @returns {*} The `value`, or the handler's returned value.
     */


    var valueOrHandler = function valueOrHandler(value) {
      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      return typeof value === 'function' ? value.apply(void 0, params) : value;
    };

    var getActualTarget = function getActualTarget(event) {
      // NOTE: If the trap is _inside_ a shadow DOM, event.target will always be the
      //  shadow host. However, event.target.composedPath() will be an array of
      //  nodes "clicked" from inner-most (the actual element inside the shadow) to
      //  outer-most (the host HTML document). If we have access to composedPath(),
      //  then use its first element; otherwise, fall back to event.target (and
      //  this only works for an _open_ shadow DOM; otherwise,
      //  composedPath()[0] === event.target always).
      return event.target.shadowRoot && typeof event.composedPath === 'function' ? event.composedPath()[0] : event.target;
    };

    var createFocusTrap = function createFocusTrap(elements, userOptions) {
      // SSR: a live trap shouldn't be created in this type of environment so this
      //  should be safe code to execute if the `document` option isn't specified
      var doc = (userOptions === null || userOptions === void 0 ? void 0 : userOptions.document) || document;

      var config = _objectSpread2({
        returnFocusOnDeactivate: true,
        escapeDeactivates: true,
        delayInitialFocus: true
      }, userOptions);

      var state = {
        // containers given to createFocusTrap()
        // @type {Array<HTMLElement>}
        containers: [],
        // list of objects identifying tabbable nodes in `containers` in the trap
        // NOTE: it's possible that a group has no tabbable nodes if nodes get removed while the trap
        //  is active, but the trap should never get to a state where there isn't at least one group
        //  with at least one tabbable node in it (that would lead to an error condition that would
        //  result in an error being thrown)
        // @type {Array<{
        //   container: HTMLElement,
        //   tabbableNodes: Array<HTMLElement>, // empty if none
        //   focusableNodes: Array<HTMLElement>, // empty if none
        //   firstTabbableNode: HTMLElement|null,
        //   lastTabbableNode: HTMLElement|null,
        //   nextTabbableNode: (node: HTMLElement, forward: boolean) => HTMLElement|undefined
        // }>}
        containerGroups: [],
        // same order/length as `containers` list
        // references to objects in `containerGroups`, but only those that actually have
        //  tabbable nodes in them
        // NOTE: same order as `containers` and `containerGroups`, but __not necessarily__
        //  the same length
        tabbableGroups: [],
        nodeFocusedBeforeActivation: null,
        mostRecentlyFocusedNode: null,
        active: false,
        paused: false,
        // timer ID for when delayInitialFocus is true and initial focus in this trap
        //  has been delayed during activation
        delayInitialFocusTimer: undefined
      };
      var trap; // eslint-disable-line prefer-const -- some private functions reference it, and its methods reference private functions, so we must declare here and define later

      /**
       * Gets a configuration option value.
       * @param {Object|undefined} configOverrideOptions If true, and option is defined in this set,
       *  value will be taken from this object. Otherwise, value will be taken from base configuration.
       * @param {string} optionName Name of the option whose value is sought.
       * @param {string|undefined} [configOptionName] Name of option to use __instead of__ `optionName`
       *  IIF `configOverrideOptions` is not defined. Otherwise, `optionName` is used.
       */

      var getOption = function getOption(configOverrideOptions, optionName, configOptionName) {
        return configOverrideOptions && configOverrideOptions[optionName] !== undefined ? configOverrideOptions[optionName] : config[configOptionName || optionName];
      };
      /**
       * Finds the index of the container that contains the element.
       * @param {HTMLElement} element
       * @returns {number} Index of the container in either `state.containers` or
       *  `state.containerGroups` (the order/length of these lists are the same); -1
       *  if the element isn't found.
       */


      var findContainerIndex = function findContainerIndex(element) {
        // NOTE: search `containerGroups` because it's possible a group contains no tabbable
        //  nodes, but still contains focusable nodes (e.g. if they all have `tabindex=-1`)
        //  and we still need to find the element in there
        return state.containerGroups.findIndex(function (_ref) {
          var container = _ref.container,
              tabbableNodes = _ref.tabbableNodes;
          return container.contains(element) || // fall back to explicit tabbable search which will take into consideration any
          //  web components if the `tabbableOptions.getShadowRoot` option was used for
          //  the trap, enabling shadow DOM support in tabbable (`Node.contains()` doesn't
          //  look inside web components even if open)
          tabbableNodes.find(function (node) {
            return node === element;
          });
        });
      };
      /**
       * Gets the node for the given option, which is expected to be an option that
       *  can be either a DOM node, a string that is a selector to get a node, `false`
       *  (if a node is explicitly NOT given), or a function that returns any of these
       *  values.
       * @param {string} optionName
       * @returns {undefined | false | HTMLElement | SVGElement} Returns
       *  `undefined` if the option is not specified; `false` if the option
       *  resolved to `false` (node explicitly not given); otherwise, the resolved
       *  DOM node.
       * @throws {Error} If the option is set, not `false`, and is not, or does not
       *  resolve to a node.
       */


      var getNodeForOption = function getNodeForOption(optionName) {
        var optionValue = config[optionName];

        if (typeof optionValue === 'function') {
          for (var _len2 = arguments.length, params = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            params[_key2 - 1] = arguments[_key2];
          }

          optionValue = optionValue.apply(void 0, params);
        }

        if (optionValue === true) {
          optionValue = undefined; // use default value
        }

        if (!optionValue) {
          if (optionValue === undefined || optionValue === false) {
            return optionValue;
          } // else, empty string (invalid), null (invalid), 0 (invalid)


          throw new Error("`".concat(optionName, "` was specified but was not a node, or did not return a node"));
        }

        var node = optionValue; // could be HTMLElement, SVGElement, or non-empty string at this point

        if (typeof optionValue === 'string') {
          node = doc.querySelector(optionValue); // resolve to node, or null if fails

          if (!node) {
            throw new Error("`".concat(optionName, "` as selector refers to no known node"));
          }
        }

        return node;
      };

      var getInitialFocusNode = function getInitialFocusNode() {
        var node = getNodeForOption('initialFocus'); // false explicitly indicates we want no initialFocus at all

        if (node === false) {
          return false;
        }

        if (node === undefined) {
          // option not specified: use fallback options
          if (findContainerIndex(doc.activeElement) >= 0) {
            node = doc.activeElement;
          } else {
            var firstTabbableGroup = state.tabbableGroups[0];
            var firstTabbableNode = firstTabbableGroup && firstTabbableGroup.firstTabbableNode; // NOTE: `fallbackFocus` option function cannot return `false` (not supported)

            node = firstTabbableNode || getNodeForOption('fallbackFocus');
          }
        }

        if (!node) {
          throw new Error('Your focus-trap needs to have at least one focusable element');
        }

        return node;
      };

      var updateTabbableNodes = function updateTabbableNodes() {
        state.containerGroups = state.containers.map(function (container) {
          var tabbableNodes = tabbable(container, config.tabbableOptions); // NOTE: if we have tabbable nodes, we must have focusable nodes; focusable nodes
          //  are a superset of tabbable nodes

          var focusableNodes = focusable(container, config.tabbableOptions);
          return {
            container: container,
            tabbableNodes: tabbableNodes,
            focusableNodes: focusableNodes,
            firstTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[0] : null,
            lastTabbableNode: tabbableNodes.length > 0 ? tabbableNodes[tabbableNodes.length - 1] : null,

            /**
             * Finds the __tabbable__ node that follows the given node in the specified direction,
             *  in this container, if any.
             * @param {HTMLElement} node
             * @param {boolean} [forward] True if going in forward tab order; false if going
             *  in reverse.
             * @returns {HTMLElement|undefined} The next tabbable node, if any.
             */
            nextTabbableNode: function nextTabbableNode(node) {
              var forward = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
              // NOTE: If tabindex is positive (in order to manipulate the tab order separate
              //  from the DOM order), this __will not work__ because the list of focusableNodes,
              //  while it contains tabbable nodes, does not sort its nodes in any order other
              //  than DOM order, because it can't: Where would you place focusable (but not
              //  tabbable) nodes in that order? They have no order, because they aren't tabbale...
              // Support for positive tabindex is already broken and hard to manage (possibly
              //  not supportable, TBD), so this isn't going to make things worse than they
              //  already are, and at least makes things better for the majority of cases where
              //  tabindex is either 0/unset or negative.
              // FYI, positive tabindex issue: https://github.com/focus-trap/focus-trap/issues/375
              var nodeIdx = focusableNodes.findIndex(function (n) {
                return n === node;
              });

              if (nodeIdx < 0) {
                return undefined;
              }

              if (forward) {
                return focusableNodes.slice(nodeIdx + 1).find(function (n) {
                  return isTabbable(n, config.tabbableOptions);
                });
              }

              return focusableNodes.slice(0, nodeIdx).reverse().find(function (n) {
                return isTabbable(n, config.tabbableOptions);
              });
            }
          };
        });
        state.tabbableGroups = state.containerGroups.filter(function (group) {
          return group.tabbableNodes.length > 0;
        }); // throw if no groups have tabbable nodes and we don't have a fallback focus node either

        if (state.tabbableGroups.length <= 0 && !getNodeForOption('fallbackFocus') // returning false not supported for this option
        ) {
          throw new Error('Your focus-trap must have at least one container with at least one tabbable node in it at all times');
        }
      };

      var tryFocus = function tryFocus(node) {
        if (node === false) {
          return;
        }

        if (node === doc.activeElement) {
          return;
        }

        if (!node || !node.focus) {
          tryFocus(getInitialFocusNode());
          return;
        }

        node.focus({
          preventScroll: !!config.preventScroll
        });
        state.mostRecentlyFocusedNode = node;

        if (isSelectableInput(node)) {
          node.select();
        }
      };

      var getReturnFocusNode = function getReturnFocusNode(previousActiveElement) {
        var node = getNodeForOption('setReturnFocus', previousActiveElement);
        return node ? node : node === false ? false : previousActiveElement;
      }; // This needs to be done on mousedown and touchstart instead of click
      // so that it precedes the focus event.


      var checkPointerDown = function checkPointerDown(e) {
        var target = getActualTarget(e);

        if (findContainerIndex(target) >= 0) {
          // allow the click since it ocurred inside the trap
          return;
        }

        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          // immediately deactivate the trap
          trap.deactivate({
            // if, on deactivation, we should return focus to the node originally-focused
            //  when the trap was activated (or the configured `setReturnFocus` node),
            //  then assume it's also OK to return focus to the outside node that was
            //  just clicked, causing deactivation, as long as that node is focusable;
            //  if it isn't focusable, then return focus to the original node focused
            //  on activation (or the configured `setReturnFocus` node)
            // NOTE: by setting `returnFocus: false`, deactivate() will do nothing,
            //  which will result in the outside click setting focus to the node
            //  that was clicked, whether it's focusable or not; by setting
            //  `returnFocus: true`, we'll attempt to re-focus the node originally-focused
            //  on activation (or the configured `setReturnFocus` node)
            returnFocus: config.returnFocusOnDeactivate && !isFocusable(target, config.tabbableOptions)
          });
          return;
        } // This is needed for mobile devices.
        // (If we'll only let `click` events through,
        // then on mobile they will be blocked anyways if `touchstart` is blocked.)


        if (valueOrHandler(config.allowOutsideClick, e)) {
          // allow the click outside the trap to take place
          return;
        } // otherwise, prevent the click


        e.preventDefault();
      }; // In case focus escapes the trap for some strange reason, pull it back in.


      var checkFocusIn = function checkFocusIn(e) {
        var target = getActualTarget(e);
        var targetContained = findContainerIndex(target) >= 0; // In Firefox when you Tab out of an iframe the Document is briefly focused.

        if (targetContained || target instanceof Document) {
          if (targetContained) {
            state.mostRecentlyFocusedNode = target;
          }
        } else {
          // escaped! pull it back in to where it just left
          e.stopImmediatePropagation();
          tryFocus(state.mostRecentlyFocusedNode || getInitialFocusNode());
        }
      }; // Hijack Tab events on the first and last focusable nodes of the trap,
      // in order to prevent focus from escaping. If it escapes for even a
      // moment it can end up scrolling the page and causing confusion so we
      // kind of need to capture the action at the keydown phase.


      var checkTab = function checkTab(e) {
        var target = getActualTarget(e);
        updateTabbableNodes();
        var destinationNode = null;

        if (state.tabbableGroups.length > 0) {
          // make sure the target is actually contained in a group
          // NOTE: the target may also be the container itself if it's focusable
          //  with tabIndex='-1' and was given initial focus
          var containerIndex = findContainerIndex(target);
          var containerGroup = containerIndex >= 0 ? state.containerGroups[containerIndex] : undefined;

          if (containerIndex < 0) {
            // target not found in any group: quite possible focus has escaped the trap,
            //  so bring it back in to...
            if (e.shiftKey) {
              // ...the last node in the last group
              destinationNode = state.tabbableGroups[state.tabbableGroups.length - 1].lastTabbableNode;
            } else {
              // ...the first node in the first group
              destinationNode = state.tabbableGroups[0].firstTabbableNode;
            }
          } else if (e.shiftKey) {
            // REVERSE
            // is the target the first tabbable node in a group?
            var startOfGroupIndex = findIndex(state.tabbableGroups, function (_ref2) {
              var firstTabbableNode = _ref2.firstTabbableNode;
              return target === firstTabbableNode;
            });

            if (startOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target, false))) {
              // an exception case where the target is either the container itself, or
              //  a non-tabbable node that was given focus (i.e. tabindex is negative
              //  and user clicked on it or node was programmatically given focus)
              //  and is not followed by any other tabbable node, in which
              //  case, we should handle shift+tab as if focus were on the container's
              //  first tabbable node, and go to the last tabbable node of the LAST group
              startOfGroupIndex = containerIndex;
            }

            if (startOfGroupIndex >= 0) {
              // YES: then shift+tab should go to the last tabbable node in the
              //  previous group (and wrap around to the last tabbable node of
              //  the LAST group if it's the first tabbable node of the FIRST group)
              var destinationGroupIndex = startOfGroupIndex === 0 ? state.tabbableGroups.length - 1 : startOfGroupIndex - 1;
              var destinationGroup = state.tabbableGroups[destinationGroupIndex];
              destinationNode = destinationGroup.lastTabbableNode;
            }
          } else {
            // FORWARD
            // is the target the last tabbable node in a group?
            var lastOfGroupIndex = findIndex(state.tabbableGroups, function (_ref3) {
              var lastTabbableNode = _ref3.lastTabbableNode;
              return target === lastTabbableNode;
            });

            if (lastOfGroupIndex < 0 && (containerGroup.container === target || isFocusable(target, config.tabbableOptions) && !isTabbable(target, config.tabbableOptions) && !containerGroup.nextTabbableNode(target))) {
              // an exception case where the target is the container itself, or
              //  a non-tabbable node that was given focus (i.e. tabindex is negative
              //  and user clicked on it or node was programmatically given focus)
              //  and is not followed by any other tabbable node, in which
              //  case, we should handle tab as if focus were on the container's
              //  last tabbable node, and go to the first tabbable node of the FIRST group
              lastOfGroupIndex = containerIndex;
            }

            if (lastOfGroupIndex >= 0) {
              // YES: then tab should go to the first tabbable node in the next
              //  group (and wrap around to the first tabbable node of the FIRST
              //  group if it's the last tabbable node of the LAST group)
              var _destinationGroupIndex = lastOfGroupIndex === state.tabbableGroups.length - 1 ? 0 : lastOfGroupIndex + 1;

              var _destinationGroup = state.tabbableGroups[_destinationGroupIndex];
              destinationNode = _destinationGroup.firstTabbableNode;
            }
          }
        } else {
          // NOTE: the fallbackFocus option does not support returning false to opt-out
          destinationNode = getNodeForOption('fallbackFocus');
        }

        if (destinationNode) {
          e.preventDefault();
          tryFocus(destinationNode);
        } // else, let the browser take care of [shift+]tab and move the focus

      };

      var checkKey = function checkKey(e) {
        if (isEscapeEvent(e) && valueOrHandler(config.escapeDeactivates, e) !== false) {
          e.preventDefault();
          trap.deactivate();
          return;
        }

        if (isTabEvent(e)) {
          checkTab(e);
          return;
        }
      };

      var checkClick = function checkClick(e) {
        var target = getActualTarget(e);

        if (findContainerIndex(target) >= 0) {
          return;
        }

        if (valueOrHandler(config.clickOutsideDeactivates, e)) {
          return;
        }

        if (valueOrHandler(config.allowOutsideClick, e)) {
          return;
        }

        e.preventDefault();
        e.stopImmediatePropagation();
      }; //
      // EVENT LISTENERS
      //


      var addListeners = function addListeners() {
        if (!state.active) {
          return;
        } // There can be only one listening focus trap at a time


        activeFocusTraps.activateTrap(trap); // Delay ensures that the focused element doesn't capture the event
        // that caused the focus trap activation.

        state.delayInitialFocusTimer = config.delayInitialFocus ? delay(function () {
          tryFocus(getInitialFocusNode());
        }) : tryFocus(getInitialFocusNode());
        doc.addEventListener('focusin', checkFocusIn, true);
        doc.addEventListener('mousedown', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('touchstart', checkPointerDown, {
          capture: true,
          passive: false
        });
        doc.addEventListener('click', checkClick, {
          capture: true,
          passive: false
        });
        doc.addEventListener('keydown', checkKey, {
          capture: true,
          passive: false
        });
        return trap;
      };

      var removeListeners = function removeListeners() {
        if (!state.active) {
          return;
        }

        doc.removeEventListener('focusin', checkFocusIn, true);
        doc.removeEventListener('mousedown', checkPointerDown, true);
        doc.removeEventListener('touchstart', checkPointerDown, true);
        doc.removeEventListener('click', checkClick, true);
        doc.removeEventListener('keydown', checkKey, true);
        return trap;
      }; //
      // TRAP DEFINITION
      //


      trap = {
        get active() {
          return state.active;
        },

        get paused() {
          return state.paused;
        },

        activate: function activate(activateOptions) {
          if (state.active) {
            return this;
          }

          var onActivate = getOption(activateOptions, 'onActivate');
          var onPostActivate = getOption(activateOptions, 'onPostActivate');
          var checkCanFocusTrap = getOption(activateOptions, 'checkCanFocusTrap');

          if (!checkCanFocusTrap) {
            updateTabbableNodes();
          }

          state.active = true;
          state.paused = false;
          state.nodeFocusedBeforeActivation = doc.activeElement;

          if (onActivate) {
            onActivate();
          }

          var finishActivation = function finishActivation() {
            if (checkCanFocusTrap) {
              updateTabbableNodes();
            }

            addListeners();

            if (onPostActivate) {
              onPostActivate();
            }
          };

          if (checkCanFocusTrap) {
            checkCanFocusTrap(state.containers.concat()).then(finishActivation, finishActivation);
            return this;
          }

          finishActivation();
          return this;
        },
        deactivate: function deactivate(deactivateOptions) {
          if (!state.active) {
            return this;
          }

          var options = _objectSpread2({
            onDeactivate: config.onDeactivate,
            onPostDeactivate: config.onPostDeactivate,
            checkCanReturnFocus: config.checkCanReturnFocus
          }, deactivateOptions);

          clearTimeout(state.delayInitialFocusTimer); // noop if undefined

          state.delayInitialFocusTimer = undefined;
          removeListeners();
          state.active = false;
          state.paused = false;
          activeFocusTraps.deactivateTrap(trap);
          var onDeactivate = getOption(options, 'onDeactivate');
          var onPostDeactivate = getOption(options, 'onPostDeactivate');
          var checkCanReturnFocus = getOption(options, 'checkCanReturnFocus');
          var returnFocus = getOption(options, 'returnFocus', 'returnFocusOnDeactivate');

          if (onDeactivate) {
            onDeactivate();
          }

          var finishDeactivation = function finishDeactivation() {
            delay(function () {
              if (returnFocus) {
                tryFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation));
              }

              if (onPostDeactivate) {
                onPostDeactivate();
              }
            });
          };

          if (returnFocus && checkCanReturnFocus) {
            checkCanReturnFocus(getReturnFocusNode(state.nodeFocusedBeforeActivation)).then(finishDeactivation, finishDeactivation);
            return this;
          }

          finishDeactivation();
          return this;
        },
        pause: function pause() {
          if (state.paused || !state.active) {
            return this;
          }

          state.paused = true;
          removeListeners();
          return this;
        },
        unpause: function unpause() {
          if (!state.paused || !state.active) {
            return this;
          }

          state.paused = false;
          updateTabbableNodes();
          addListeners();
          return this;
        },
        updateContainerElements: function updateContainerElements(containerElements) {
          var elementsAsArray = [].concat(containerElements).filter(Boolean);
          state.containers = elementsAsArray.map(function (element) {
            return typeof element === 'string' ? doc.querySelector(element) : element;
          });

          if (state.active) {
            updateTabbableNodes();
          }

          return this;
        }
      }; // initialize container elements

      trap.updateContainerElements(elements);
      return trap;
    };

    /* node_modules/fluent-svelte/ComboBox/ComboBoxItem.svelte generated by Svelte v3.59.2 */
    const file$B = "node_modules/fluent-svelte/ComboBox/ComboBoxItem.svelte";
    const get_icon_slot_changes$4 = dirty => ({});
    const get_icon_slot_context$4 = ctx => ({});

    function create_fragment$B(ctx) {
    	let li;
    	let t;
    	let span;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[6].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[5], get_icon_slot_context$4);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	let li_levels = [
    		{ tabindex: "0" },
    		{
    			class: li_class_value = "combo-box-item " + /*className*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[4]
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (icon_slot) icon_slot.c();
    			t = space();
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-and1le");
    			add_location(span, file$B, 18, 1, 462);
    			set_attributes(li, li_data);
    			toggle_class(li, "selected", /*selected*/ ctx[0]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "svelte-and1le", true);
    			add_location(li, file$B, 9, 0, 314);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (icon_slot) {
    				icon_slot.m(li, null);
    			}

    			append_dev(li, t);
    			append_dev(li, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[3].call(null, li));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[5], dirty, get_icon_slot_changes$4),
    						get_icon_slot_context$4
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				{ tabindex: "0" },
    				(!current || dirty & /*className*/ 4 && li_class_value !== (li_class_value = "combo-box-item " + /*className*/ ctx[2])) && { class: li_class_value },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(li, "selected", /*selected*/ ctx[0]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[1]);
    			toggle_class(li, "svelte-and1le", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (icon_slot) icon_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$B.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$B($$self, $$props, $$invalidate) {
    	const omit_props_names = ["selected","disabled","class"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComboBoxItem', slots, ['icon','default']);
    	let { selected = false } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		get_current_component,
    		selected,
    		disabled,
    		className,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$new_props.selected);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [selected, disabled, className, forwardEvents, $$restProps, $$scope, slots];
    }

    class ComboBoxItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$B, create_fragment$B, safe_not_equal, { selected: 0, disabled: 1, class: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComboBoxItem",
    			options,
    			id: create_fragment$B.name
    		});
    	}

    	get selected() {
    		throw new Error("<ComboBoxItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<ComboBoxItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ComboBoxItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ComboBoxItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ComboBoxItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ComboBoxItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Flyout/FlyoutSurface.svelte generated by Svelte v3.59.2 */
    const file$A = "node_modules/fluent-svelte/Flyout/FlyoutSurface.svelte";

    function create_fragment$A(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let div_levels = [
    		{
    			class: div_class_value = "flyout " + /*className*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-zbytle", true);
    			add_location(div, file$A, 10, 0, 399);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[2].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = "flyout " + /*className*/ ctx[1])) && { class: div_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(div, "svelte-zbytle", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$A.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$A($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlyoutSurface', slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		className,
    		element,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, className, forwardEvents, $$restProps, $$scope, slots, div_binding];
    }

    class FlyoutSurface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$A, create_fragment$A, safe_not_equal, { class: 1, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlyoutSurface",
    			options,
    			id: create_fragment$A.name
    		});
    	}

    	get class() {
    		throw new Error("<FlyoutSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FlyoutSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<FlyoutSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<FlyoutSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Tooltip/TooltipSurface.svelte generated by Svelte v3.59.2 */
    const file$z = "node_modules/fluent-svelte/Tooltip/TooltipSurface.svelte";

    function create_fragment$z(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let div_levels = [
    		{
    			class: div_class_value = "tooltip " + /*className*/ ctx[1]
    		},
    		{ role: "tooltip" },
    		/*$$restProps*/ ctx[3]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-gc7m6k", true);
    			add_location(div, file$z, 10, 0, 399);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[6](div);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[2].call(null, div));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className*/ 2 && div_class_value !== (div_class_value = "tooltip " + /*className*/ ctx[1])) && { class: div_class_value },
    				{ role: "tooltip" },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(div, "svelte-gc7m6k", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$z.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$z($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TooltipSurface', slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		get_current_component,
    		className,
    		element,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, className, forwardEvents, $$restProps, $$scope, slots, div_binding];
    }

    class TooltipSurface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$z, create_fragment$z, safe_not_equal, { class: 1, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TooltipSurface",
    			options,
    			id: create_fragment$z.name
    		});
    	}

    	get class() {
    		throw new Error("<TooltipSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TooltipSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<TooltipSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<TooltipSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/MenuFlyout/MenuFlyoutSurface.svelte generated by Svelte v3.59.2 */

    const file$y = "node_modules/fluent-svelte/MenuFlyout/MenuFlyoutSurface.svelte";

    function create_fragment$y(ctx) {
    	let div;
    	let ul;
    	let ul_class_value;
    	let div_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	let ul_levels = [
    		{
    			class: ul_class_value = "menu-flyout " + /*className*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[3]
    	];

    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "svelte-1qibxfp", true);
    			add_location(ul, file$y, 12, 1, 359);
    			attr_dev(div, "class", "menu-flyout-surface-container svelte-1qibxfp");

    			attr_dev(div, "style", div_style_value = /*animationComplete*/ ctx[2]
    			? "overflow: visible;"
    			: undefined);

    			add_location(div, file$y, 8, 0, 250);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			/*ul_binding*/ ctx[7](ul);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(ul, "animationend", /*animationend_handler*/ ctx[6], { once: true }, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[4],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[4])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[4], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				(!current || dirty & /*className*/ 2 && ul_class_value !== (ul_class_value = "menu-flyout " + /*className*/ ctx[1])) && { class: ul_class_value },
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3]
    			]));

    			toggle_class(ul, "svelte-1qibxfp", true);

    			if (!current || dirty & /*animationComplete*/ 4 && div_style_value !== (div_style_value = /*animationComplete*/ ctx[2]
    			? "overflow: visible;"
    			: undefined)) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*ul_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$y.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$y($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuFlyoutSurface', slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let animationComplete = false;
    	const animationend_handler = () => $$invalidate(2, animationComplete = true);

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(4, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ className, element, animationComplete });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('animationComplete' in $$props) $$invalidate(2, animationComplete = $$new_props.animationComplete);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		className,
    		animationComplete,
    		$$restProps,
    		$$scope,
    		slots,
    		animationend_handler,
    		ul_binding
    	];
    }

    class MenuFlyoutSurface extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$y, create_fragment$y, safe_not_equal, { class: 1, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuFlyoutSurface",
    			options,
    			id: create_fragment$y.name
    		});
    	}

    	get class() {
    		throw new Error("<MenuFlyoutSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuFlyoutSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<MenuFlyoutSurface>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<MenuFlyoutSurface>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/CalendarView/CalendarViewItem.svelte generated by Svelte v3.59.2 */

    const file$x = "node_modules/fluent-svelte/CalendarView/CalendarViewItem.svelte";

    // (24:1) {#if header}
    function create_if_block$n(ctx) {
    	let small;
    	let t;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t = text(/*header*/ ctx[6]);
    			attr_dev(small, "class", "svelte-13n7j23");
    			add_location(small, file$x, 24, 2, 537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*header*/ 64) set_data_dev(t, /*header*/ ctx[6]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$n.name,
    		type: "if",
    		source: "(24:1) {#if header}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$x(ctx) {
    	let button;
    	let t;
    	let button_class_value;
    	let button_disabled_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*header*/ ctx[6] && create_if_block$n(ctx);
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let button_levels = [
    		{ type: "button" },
    		{
    			class: button_class_value = "calendar-view-item type-" + (/*variant*/ ctx[5] === 'day' ? 'day' : 'month-year')
    		},
    		{
    			disabled: button_disabled_value = /*disabled*/ ctx[1] || /*blackout*/ ctx[2]
    		},
    		{ "aria-selected": /*selected*/ ctx[0] },
    		/*$$restProps*/ ctx[7]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "selected", /*selected*/ ctx[0]);
    			toggle_class(button, "current", /*current*/ ctx[3]);
    			toggle_class(button, "blackout", /*blackout*/ ctx[2]);
    			toggle_class(button, "disabled", /*disabled*/ ctx[1]);
    			toggle_class(button, "out-of-range", /*outOfRange*/ ctx[4]);
    			toggle_class(button, "svelte-13n7j23", true);
    			add_location(button, file$x, 9, 0, 225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			if (if_block) if_block.m(button, null);
    			append_dev(button, t);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[10], false, false, false, false),
    					listen_dev(button, "keydown", /*keydown_handler*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*header*/ ctx[6]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$n(ctx);
    					if_block.c();
    					if_block.m(button, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				{ type: "button" },
    				(!current || dirty & /*variant*/ 32 && button_class_value !== (button_class_value = "calendar-view-item type-" + (/*variant*/ ctx[5] === 'day' ? 'day' : 'month-year'))) && { class: button_class_value },
    				(!current || dirty & /*disabled, blackout*/ 6 && button_disabled_value !== (button_disabled_value = /*disabled*/ ctx[1] || /*blackout*/ ctx[2])) && { disabled: button_disabled_value },
    				(!current || dirty & /*selected*/ 1) && { "aria-selected": /*selected*/ ctx[0] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(button, "selected", /*selected*/ ctx[0]);
    			toggle_class(button, "current", /*current*/ ctx[3]);
    			toggle_class(button, "blackout", /*blackout*/ ctx[2]);
    			toggle_class(button, "disabled", /*disabled*/ ctx[1]);
    			toggle_class(button, "out-of-range", /*outOfRange*/ ctx[4]);
    			toggle_class(button, "svelte-13n7j23", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (if_block) if_block.d();
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$x.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$x($$self, $$props, $$invalidate) {
    	const omit_props_names = ["selected","disabled","blackout","current","outOfRange","variant","header"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarViewItem', slots, ['default']);
    	let { selected = false } = $$props;
    	let { disabled = false } = $$props;
    	let { blackout = false } = $$props;
    	let { current = false } = $$props;
    	let { outOfRange = false } = $$props;
    	let { variant = "day" } = $$props;
    	let { header = "" } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(0, selected = $$new_props.selected);
    		if ('disabled' in $$new_props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('blackout' in $$new_props) $$invalidate(2, blackout = $$new_props.blackout);
    		if ('current' in $$new_props) $$invalidate(3, current = $$new_props.current);
    		if ('outOfRange' in $$new_props) $$invalidate(4, outOfRange = $$new_props.outOfRange);
    		if ('variant' in $$new_props) $$invalidate(5, variant = $$new_props.variant);
    		if ('header' in $$new_props) $$invalidate(6, header = $$new_props.header);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		selected,
    		disabled,
    		blackout,
    		current,
    		outOfRange,
    		variant,
    		header
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selected' in $$props) $$invalidate(0, selected = $$new_props.selected);
    		if ('disabled' in $$props) $$invalidate(1, disabled = $$new_props.disabled);
    		if ('blackout' in $$props) $$invalidate(2, blackout = $$new_props.blackout);
    		if ('current' in $$props) $$invalidate(3, current = $$new_props.current);
    		if ('outOfRange' in $$props) $$invalidate(4, outOfRange = $$new_props.outOfRange);
    		if ('variant' in $$props) $$invalidate(5, variant = $$new_props.variant);
    		if ('header' in $$props) $$invalidate(6, header = $$new_props.header);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selected,
    		disabled,
    		blackout,
    		current,
    		outOfRange,
    		variant,
    		header,
    		$$restProps,
    		$$scope,
    		slots,
    		click_handler,
    		keydown_handler
    	];
    }

    class CalendarViewItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$x, create_fragment$x, safe_not_equal, {
    			selected: 0,
    			disabled: 1,
    			blackout: 2,
    			current: 3,
    			outOfRange: 4,
    			variant: 5,
    			header: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarViewItem",
    			options,
    			id: create_fragment$x.name
    		});
    	}

    	get selected() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blackout() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blackout(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get current() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set current(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outOfRange() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outOfRange(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variant() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get header() {
    		throw new Error("<CalendarViewItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set header(value) {
    		throw new Error("<CalendarViewItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function externalMouseEvents(node, options = { type: "click", stopPropagation: false }) {
        const { type, stopPropagation } = options;
        const handleEvent = (event) => {
            if (stopPropagation)
                event.stopPropagation();
            if (node && !node.contains(event.target) && !event.defaultPrevented) {
                node.dispatchEvent(new CustomEvent(`outer${type}`, {
                    detail: event
                }));
            }
        };
        document.addEventListener(type, handleEvent, true);
        return {
            destroy() {
                document.removeEventListener(type, handleEvent, true);
            }
        };
    }
    // Basic wrapper action around focus-trap
    function focusTrap(node, options) {
        const trap = createFocusTrap(node, (options = { ...options, fallbackFocus: node }));
        trap.activate();
        return {
            destroy() {
                trap.deactivate();
            }
        };
    }
    // ID generator for handling WAI-ARIA related attributes
    function uid(prefix) {
        return (prefix +
            String.fromCharCode(Math.floor(Math.random() * 26) + 97) +
            Math.random().toString(16).slice(2) +
            Date.now().toString(16).split(".")[0]);
    }
    // Controls the focus of a list of elements by using the arrow keys
    function arrowNavigation(node, options = { preventTab: false, stopPropagation: false }) {
        const handleKeyDown = (event) => {
            const { key } = event;
            const { activeElement } = document;
            let tabOrder = tabbable(node);
            // if (directChildren) tabOrder = tabOrder.filter(child => child.parentElement === node);
            const activeIndex = tabOrder.indexOf(document.activeElement);
            if (tabOrder.length < 0)
                return;
            if (key === "ArrowUp" ||
                key === "ArrowDown" ||
                key === "Home" ||
                key === "End" ||
                (key === "Tab" && options.preventTab)) {
                event.preventDefault();
                if (options.stopPropagation)
                    event.stopPropagation();
            }
            if (key === "ArrowUp") {
                if (tabOrder[0] === activeElement) {
                    tabOrder[tabOrder.length - 1].focus();
                }
                else if (tabOrder.includes(activeElement)) {
                    tabOrder[activeIndex - 1].focus();
                }
            }
            else if (key === "ArrowDown") {
                if (tabOrder[tabOrder.length - 1] === activeElement) {
                    tabOrder[0].focus();
                }
                else if (tabOrder.includes(activeElement)) {
                    tabOrder[activeIndex + 1].focus();
                }
            }
            else if (key === "Home") {
                tabOrder[0].focus();
            }
            else if (key === "End") {
                tabOrder[tabOrder.length - 1].focus();
            }
        };
        node.addEventListener("keydown", handleKeyDown);
        return {
            destroy: () => node.removeEventListener("keydown", handleKeyDown)
        };
    }
    // Returns a number representing the duration of a specified CSS custom property in ms
    function getCSSDuration(property) {
        const duration = window.getComputedStyle(document.documentElement).getPropertyValue(property);
        return parseFloat(duration) * (/\ds$/.test(duration) ? 1000 : 1) || 0;
    }
    // Function for forwarding DOM events to the component's declaration
    // Adapted from rgossiaux/svelte-headlessui which is modified from hperrin/svelte-material-ui
    function createEventForwarder(component, exclude = []) {
        // This is our pseudo $on function. It is defined on component mount.
        let $on;
        // This is a list of events bound before mount.
        let events = [];
        // Monkeypatch SvelteComponent.$on with our own forward-compatible version
        component.$on = (eventType, callback) => {
            let destructor = () => { };
            if (exclude.includes(eventType)) {
                // Bail out of the event forwarding and run the normal Svelte $on() code
                const callbacks = component.$$.callbacks[eventType] || (component.$$.callbacks[eventType] = []);
                callbacks.push(callback);
                return () => {
                    const index = callbacks.indexOf(callback);
                    if (index !== -1)
                        callbacks.splice(index, 1);
                };
            }
            if ($on) {
                destructor = $on(eventType, callback); // The event was bound programmatically.
            }
            else {
                events.push([eventType, callback]); // The event was bound before mount by Svelte.
            }
            return () => destructor();
        };
        return (node) => {
            const destructors = [];
            const forwardDestructors = {};
            const forward = (e) => bubble(component, e);
            // This function is responsible for listening and forwarding
            // all bound events.
            $on = (eventType, callback) => {
                let handler = callback;
                // DOM addEventListener options argument.
                let options = false;
                // Listen for the event directly, with the given options.
                const off = listen(node, eventType, handler, options);
                const destructor = () => {
                    off();
                    const idx = destructors.indexOf(destructor);
                    if (idx > -1) {
                        destructors.splice(idx, 1);
                    }
                };
                destructors.push(destructor);
                // Forward the event from Svelte.
                if (!(eventType in forwardDestructors)) {
                    forwardDestructors[eventType] = listen(node, eventType, forward);
                }
                return destructor;
            };
            // Listen to all the events added before mount.
            for (const event of events) {
                $on(event[0], event[1]);
            }
            return {
                destroy: () => {
                    // Remove all event listeners.
                    for (const destructor of destructors) {
                        destructor();
                    }
                    // Remove all event forwarders.
                    for (let entry of Object.entries(forwardDestructors)) {
                        entry[1]();
                    }
                }
            };
        };
    }

    /* node_modules/fluent-svelte/Button/Button.svelte generated by Svelte v3.59.2 */
    const file$w = "node_modules/fluent-svelte/Button/Button.svelte";

    // (26:0) <svelte:element  this={href && !disabled ? "a" : "button"}  use:forwardEvents  bind:this={element}  role={href && !disabled ? "button" : undefined}  href={href && !disabled ? href : undefined}  class="button style-{variant} {className}"  class:disabled  {...$$restProps} >
    function create_dynamic_element$2(ctx) {
    	let svelte_element;
    	let svelte_element_role_value;
    	let svelte_element_href_value;
    	let svelte_element_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let svelte_element_levels = [
    		{
    			role: svelte_element_role_value = /*href*/ ctx[2] && !/*disabled*/ ctx[3]
    			? "button"
    			: undefined
    		},
    		{
    			href: svelte_element_href_value = /*href*/ ctx[2] && !/*disabled*/ ctx[3]
    			? /*href*/ ctx[2]
    			: undefined
    		},
    		{
    			class: svelte_element_class_value = "button style-" + /*variant*/ ctx[1] + " " + /*className*/ ctx[4]
    		},
    		/*$$restProps*/ ctx[6]
    	];

    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button");
    			if (default_slot) default_slot.c();
    			set_dynamic_element_data(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button")(svelte_element, svelte_element_data);
    			toggle_class(svelte_element, "disabled", /*disabled*/ ctx[3]);
    			toggle_class(svelte_element, "svelte-1ulhukx", true);
    			add_location(svelte_element, file$w, 25, 0, 1065);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			/*svelte_element_binding*/ ctx[9](svelte_element);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[5].call(null, svelte_element));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_dynamic_element_data(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button")(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
    				(!current || dirty & /*href, disabled*/ 12 && svelte_element_role_value !== (svelte_element_role_value = /*href*/ ctx[2] && !/*disabled*/ ctx[3]
    				? "button"
    				: undefined)) && { role: svelte_element_role_value },
    				(!current || dirty & /*href, disabled*/ 12 && svelte_element_href_value !== (svelte_element_href_value = /*href*/ ctx[2] && !/*disabled*/ ctx[3]
    				? /*href*/ ctx[2]
    				: undefined)) && { href: svelte_element_href_value },
    				(!current || dirty & /*variant, className*/ 18 && svelte_element_class_value !== (svelte_element_class_value = "button style-" + /*variant*/ ctx[1] + " " + /*className*/ ctx[4])) && { class: svelte_element_class_value },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(svelte_element, "disabled", /*disabled*/ ctx[3]);
    			toggle_class(svelte_element, "svelte-1ulhukx", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			/*svelte_element_binding*/ ctx[9](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element$2.name,
    		type: "child_dynamic_element",
    		source: "(26:0) <svelte:element  this={href && !disabled ? \\\"a\\\" : \\\"button\\\"}  use:forwardEvents  bind:this={element}  role={href && !disabled ? \\\"button\\\" : undefined}  href={href && !disabled ? href : undefined}  class=\\\"button style-{variant} {className}\\\"  class:disabled  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$w(ctx) {
    	let previous_tag = /*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button";
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button");
    	validate_void_dynamic_element(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button");
    	let svelte_element = (/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button") && create_dynamic_element$2(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button") {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element$2(ctx);
    					previous_tag = /*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button";
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button")) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button");
    					validate_void_dynamic_element(/*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button");
    					svelte_element = create_dynamic_element$2(ctx);
    					previous_tag = /*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button";
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    				previous_tag = /*href*/ ctx[2] && !/*disabled*/ ctx[3] ? "a" : "button";
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$w.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$w($$self, $$props, $$invalidate) {
    	const omit_props_names = ["variant","href","disabled","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	let { variant = "standard" } = $$props;
    	let { href = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function svelte_element_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('variant' in $$new_props) $$invalidate(1, variant = $$new_props.variant);
    		if ('href' in $$new_props) $$invalidate(2, href = $$new_props.href);
    		if ('disabled' in $$new_props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		variant,
    		href,
    		disabled,
    		className,
    		element,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('variant' in $$props) $$invalidate(1, variant = $$new_props.variant);
    		if ('href' in $$props) $$invalidate(2, href = $$new_props.href);
    		if ('disabled' in $$props) $$invalidate(3, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		variant,
    		href,
    		disabled,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$scope,
    		slots,
    		svelte_element_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$w, create_fragment$w, safe_not_equal, {
    			variant: 1,
    			href: 2,
    			disabled: 3,
    			class: 4,
    			element: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$w.name
    		});
    	}

    	get variant() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Checkbox/Checkbox.svelte generated by Svelte v3.59.2 */
    const file$v = "node_modules/fluent-svelte/Checkbox/Checkbox.svelte";

    // (54:3) {:else}
    function create_else_block$8(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "path-checkmark svelte-4ss5hf");
    			attr_dev(path, "d", "M 4.5303 12.9697 L 8.5 16.9393 L 18.9697 6.4697");
    			attr_dev(path, "fill", "none");
    			add_location(path, file$v, 54, 4, 2594);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(54:3) {:else}",
    		ctx
    	});

    	return block;
    }

    // (49:3) {#if indeterminate}
    function create_if_block_1$c(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "class", "path-indeterminate svelte-4ss5hf");
    			attr_dev(path, "d", "M213.5,554.5C207.5,554.5 201.917,553.417 196.75,551.25C191.583,549.083 187.083,546.083 183.25,542.25C179.417,538.417 176.333,533.917 174,528.75C171.667,523.583 170.5,518 170.5,512C170.5,506 171.667,500.417 174,495.25C176.333,490.083 179.417,485.583 183.25,481.75C187.083,477.917 191.583,474.917 196.75,472.75C201.917,470.583 207.5,469.5 213.5,469.5L810.5,469.5C816.5,469.5 822.083,470.583 827.25,472.75C832.417,474.917 836.917,477.917 840.75,481.75C844.583,485.583 847.667,490.083 850,495.25C852.333,500.417 853.5,506 853.5,512C853.5,518 852.333,523.583 850,528.75C847.667,533.917 844.583,538.417 840.75,542.25C836.917,546.083 832.417,549.083 827.25,551.25C822.083,553.417 816.5,554.5 810.5,554.5Z");
    			add_location(path, file$v, 49, 4, 1827);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$c.name,
    		type: "if",
    		source: "(49:3) {#if indeterminate}",
    		ctx
    	});

    	return block;
    }

    // (63:1) {#if $$slots.default}
    function create_if_block$m(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-4ss5hf");
    			add_location(span, file$v, 63, 2, 2760);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$m.name,
    		type: "if",
    		source: "(63:1) {#if $$slots.default}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$v(ctx) {
    	let label;
    	let div;
    	let input;
    	let input_class_value;
    	let t0;
    	let svg;
    	let svg_viewBox_value;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "checkbox" },
    		{
    			class: input_class_value = "checkbox " + /*className*/ ctx[6]
    		},
    		{ __value: /*value*/ ctx[4] },
    		{ disabled: /*disabled*/ ctx[5] },
    		/*$$restProps*/ ctx[8]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	function select_block_type(ctx, dirty) {
    		if (/*indeterminate*/ ctx[1]) return create_if_block_1$c;
    		return create_else_block$8;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*$$slots*/ ctx[9].default && create_if_block$m(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			div = element("div");
    			input = element("input");
    			t0 = space();
    			svg = svg_element("svg");
    			if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(input, input_data);
    			if (/*checked*/ ctx[0] === void 0 || /*indeterminate*/ ctx[1] === void 0) add_render_callback(() => /*input_change_handler*/ ctx[12].call(input));
    			toggle_class(input, "svelte-4ss5hf", true);
    			add_location(input, file$v, 32, 2, 1486);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "checkbox-glyph svelte-4ss5hf");

    			attr_dev(svg, "viewBox", svg_viewBox_value = /*indeterminate*/ ctx[1]
    			? "171 470 683 85"
    			: "0 0 24 24");

    			add_location(svg, file$v, 43, 2, 1683);
    			attr_dev(div, "class", "checkbox-inner svelte-4ss5hf");
    			add_location(div, file$v, 31, 1, 1455);
    			attr_dev(label, "class", "checkbox-container svelte-4ss5hf");
    			toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    			toggle_class(label, "indeterminate", /*indeterminate*/ ctx[1]);
    			add_location(label, file$v, 30, 0, 1355);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, div);
    			append_dev(div, input);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			input.indeterminate = /*indeterminate*/ ctx[1];
    			/*input_binding*/ ctx[13](input);
    			append_dev(div, t0);
    			append_dev(div, svg);
    			if_block0.m(svg, null);
    			append_dev(label, t1);
    			if (if_block1) if_block1.m(label, null);
    			/*label_binding*/ ctx[14](label);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, input)),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "checkbox" },
    				(!current || dirty & /*className*/ 64 && input_class_value !== (input_class_value = "checkbox " + /*className*/ ctx[6])) && { class: input_class_value },
    				(!current || dirty & /*value*/ 16) && { __value: /*value*/ ctx[4] },
    				(!current || dirty & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			if (dirty & /*indeterminate*/ 2) {
    				input.indeterminate = /*indeterminate*/ ctx[1];
    			}

    			toggle_class(input, "svelte-4ss5hf", true);

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(svg, null);
    				}
    			}

    			if (!current || dirty & /*indeterminate*/ 2 && svg_viewBox_value !== (svg_viewBox_value = /*indeterminate*/ ctx[1]
    			? "171 470 683 85"
    			: "0 0 24 24")) {
    				attr_dev(svg, "viewBox", svg_viewBox_value);
    			}

    			if (/*$$slots*/ ctx[9].default) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 512) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$m(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(label, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*disabled*/ 32) {
    				toggle_class(label, "disabled", /*disabled*/ ctx[5]);
    			}

    			if (!current || dirty & /*indeterminate*/ 2) {
    				toggle_class(label, "indeterminate", /*indeterminate*/ ctx[1]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*input_binding*/ ctx[13](null);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			/*label_binding*/ ctx[14](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$v.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$v($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"checked","indeterminate","value","disabled","class","inputElement","containerElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Checkbox', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { checked = false } = $$props;
    	let { indeterminate = false } = $$props;
    	let { value = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function input_change_handler() {
    		checked = this.checked;
    		indeterminate = this.indeterminate;
    		$$invalidate(0, checked);
    		$$invalidate(1, indeterminate);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(2, inputElement);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(3, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('indeterminate' in $$new_props) $$invalidate(1, indeterminate = $$new_props.indeterminate);
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(3, containerElement = $$new_props.containerElement);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		checked,
    		indeterminate,
    		value,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('indeterminate' in $$props) $$invalidate(1, indeterminate = $$new_props.indeterminate);
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(6, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(3, containerElement = $$new_props.containerElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		checked,
    		indeterminate,
    		inputElement,
    		containerElement,
    		value,
    		disabled,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		input_change_handler,
    		input_binding,
    		label_binding
    	];
    }

    class Checkbox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$v, create_fragment$v, safe_not_equal, {
    			checked: 0,
    			indeterminate: 1,
    			value: 4,
    			disabled: 5,
    			class: 6,
    			inputElement: 2,
    			containerElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Checkbox",
    			options,
    			id: create_fragment$v.name
    		});
    	}

    	get checked() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indeterminate() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indeterminate(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<Checkbox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<Checkbox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ToggleSwitch/ToggleSwitch.svelte generated by Svelte v3.59.2 */
    const file$u = "node_modules/fluent-svelte/ToggleSwitch/ToggleSwitch.svelte";

    // (38:1) {#if $$slots.default}
    function create_if_block$l(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-16ydm79");
    			add_location(span, file$u, 38, 2, 1528);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$l.name,
    		type: "if",
    		source: "(38:1) {#if $$slots.default}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$u(ctx) {
    	let label;
    	let input;
    	let input_class_value;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{
    			class: input_class_value = "toggle-switch " + /*className*/ ctx[5]
    		},
    		{ type: "checkbox" },
    		{ __value: /*value*/ ctx[3] },
    		{ disabled: /*disabled*/ ctx[4] },
    		/*$$restProps*/ ctx[7]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block = /*$$slots*/ ctx[8].default && create_if_block$l(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-16ydm79", true);
    			add_location(input, file$u, 27, 1, 1334);
    			attr_dev(label, "class", "toggle-switch-container svelte-16ydm79");
    			add_location(label, file$u, 26, 0, 1264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			if (input.autofocus) input.focus();
    			input.checked = /*checked*/ ctx[0];
    			/*input_binding*/ ctx[12](input);
    			append_dev(label, t);
    			if (if_block) if_block.m(label, null);
    			/*label_binding*/ ctx[13](label);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[6].call(null, input)),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[11])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty & /*className*/ 32 && input_class_value !== (input_class_value = "toggle-switch " + /*className*/ ctx[5])) && { class: input_class_value },
    				{ type: "checkbox" },
    				(!current || dirty & /*value*/ 8) && { __value: /*value*/ ctx[3] },
    				(!current || dirty & /*disabled*/ 16) && { disabled: /*disabled*/ ctx[4] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			if (dirty & /*checked*/ 1) {
    				input.checked = /*checked*/ ctx[0];
    			}

    			toggle_class(input, "svelte-16ydm79", true);

    			if (/*$$slots*/ ctx[8].default) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 256) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$l(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(label, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*input_binding*/ ctx[12](null);
    			if (if_block) if_block.d();
    			/*label_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$u.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$u($$self, $$props, $$invalidate) {
    	const omit_props_names = ["checked","value","disabled","class","inputElement","containerElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToggleSwitch', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { checked = false } = $$props;
    	let { value = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function input_change_handler() {
    		checked = this.checked;
    		$$invalidate(0, checked);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(2, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('checked' in $$new_props) $$invalidate(0, checked = $$new_props.checked);
    		if ('value' in $$new_props) $$invalidate(3, value = $$new_props.value);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		checked,
    		value,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('checked' in $$props) $$invalidate(0, checked = $$new_props.checked);
    		if ('value' in $$props) $$invalidate(3, value = $$new_props.value);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(2, containerElement = $$new_props.containerElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		checked,
    		inputElement,
    		containerElement,
    		value,
    		disabled,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		input_change_handler,
    		input_binding,
    		label_binding
    	];
    }

    class ToggleSwitch extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$u, create_fragment$u, safe_not_equal, {
    			checked: 0,
    			value: 3,
    			disabled: 4,
    			class: 5,
    			inputElement: 1,
    			containerElement: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToggleSwitch",
    			options,
    			id: create_fragment$u.name
    		});
    	}

    	get checked() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<ToggleSwitch>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<ToggleSwitch>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/RadioButton/RadioButton.svelte generated by Svelte v3.59.2 */
    const file$t = "node_modules/fluent-svelte/RadioButton/RadioButton.svelte";

    // (49:1) {#if $$slots.default}
    function create_if_block$k(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr_dev(span, "class", "svelte-hhkzib");
    			add_location(span, file$t, 49, 2, 2035);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$k.name,
    		type: "if",
    		source: "(49:1) {#if $$slots.default}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$t(ctx) {
    	let label;
    	let input;
    	let input_class_value;
    	let t;
    	let current;
    	let binding_group;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ type: "radio" },
    		{
    			class: input_class_value = "radio-button " + /*className*/ ctx[6]
    		},
    		{ __value: /*value*/ ctx[4] },
    		{ checked: /*checked*/ ctx[3] },
    		{ disabled: /*disabled*/ ctx[5] },
    		/*$$restProps*/ ctx[8]
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block = /*$$slots*/ ctx[9].default && create_if_block$k(ctx);
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[13][0]);

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-hhkzib", true);
    			add_location(input, file$t, 37, 1, 1835);
    			attr_dev(label, "class", "radio-button-container svelte-hhkzib");
    			add_location(label, file$t, 36, 0, 1766);
    			binding_group.p(input);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			if (input.autofocus) input.focus();
    			input.checked = input.__value === /*group*/ ctx[0];
    			/*input_binding*/ ctx[14](input);
    			append_dev(label, t);
    			if (if_block) if_block.m(label, null);
    			/*label_binding*/ ctx[15](label);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, input)),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[12])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				{ type: "radio" },
    				(!current || dirty & /*className*/ 64 && input_class_value !== (input_class_value = "radio-button " + /*className*/ ctx[6])) && { class: input_class_value },
    				(!current || dirty & /*value*/ 16) && { __value: /*value*/ ctx[4] },
    				(!current || dirty & /*checked*/ 8) && { checked: /*checked*/ ctx[3] },
    				(!current || dirty & /*disabled*/ 32) && { disabled: /*disabled*/ ctx[5] },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			if (dirty & /*group*/ 1) {
    				input.checked = input.__value === /*group*/ ctx[0];
    			}

    			toggle_class(input, "svelte-hhkzib", true);

    			if (/*$$slots*/ ctx[9].default) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 512) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$k(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(label, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			/*input_binding*/ ctx[14](null);
    			if (if_block) if_block.d();
    			/*label_binding*/ ctx[15](null);
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$t.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$t($$self, $$props, $$invalidate) {
    	const omit_props_names = ["group","checked","value","disabled","class","inputElement","containerElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('RadioButton', slots, ['default']);
    	const $$slots = compute_slots(slots);
    	let { group = undefined } = $$props;
    	let { checked = false } = $$props;
    	let { value = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());
    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(0, group);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(2, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('group' in $$new_props) $$invalidate(0, group = $$new_props.group);
    		if ('checked' in $$new_props) $$invalidate(3, checked = $$new_props.checked);
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$new_props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(6, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		group,
    		checked,
    		value,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('group' in $$props) $$invalidate(0, group = $$new_props.group);
    		if ('checked' in $$props) $$invalidate(3, checked = $$new_props.checked);
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$props) $$invalidate(5, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(6, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(2, containerElement = $$new_props.containerElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		group,
    		inputElement,
    		containerElement,
    		checked,
    		value,
    		disabled,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		input_change_handler,
    		$$binding_groups,
    		input_binding,
    		label_binding
    	];
    }

    class RadioButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$t, create_fragment$t, safe_not_equal, {
    			group: 0,
    			checked: 3,
    			value: 4,
    			disabled: 5,
    			class: 6,
    			inputElement: 1,
    			containerElement: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RadioButton",
    			options,
    			id: create_fragment$t.name
    		});
    	}

    	get group() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<RadioButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<RadioButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ProgressRing/ProgressRing.svelte generated by Svelte v3.59.2 */
    const file$s = "node_modules/fluent-svelte/ProgressRing/ProgressRing.svelte";

    function create_fragment$s(ctx) {
    	let svg;
    	let circle;
    	let circle_stroke_dashoffset_value;
    	let svg_class_value;
    	let svg_role_value;
    	let svg_aria_valuemin_value;
    	let svg_aria_valuemax_value;
    	let mounted;
    	let dispose;

    	let svg_levels = [
    		{ tabindex: "-1" },
    		{
    			class: svg_class_value = "progress-ring " + /*className*/ ctx[4]
    		},
    		{ width: /*size*/ ctx[3] },
    		{ height: /*size*/ ctx[3] },
    		{ viewBox: "0 0 16 16" },
    		{
    			role: svg_role_value = /*value*/ ctx[0] ? "progressbar" : "status"
    		},
    		{
    			"aria-valuemin": svg_aria_valuemin_value = !/*indeterminate*/ ctx[6] ? 0 : undefined
    		},
    		{
    			"aria-valuemax": svg_aria_valuemax_value = !/*indeterminate*/ ctx[6] ? 100 : undefined
    		},
    		{ "aria-valuenow": /*value*/ ctx[0] },
    		/*$$restProps*/ ctx[8]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "cx", "50%");
    			attr_dev(circle, "cy", "50%");
    			attr_dev(circle, "r", "7");
    			attr_dev(circle, "stroke-dasharray", "3");
    			attr_dev(circle, "stroke-dashoffset", circle_stroke_dashoffset_value = (100 - /*value*/ ctx[0]) / 100 * /*circumference*/ ctx[5]);
    			attr_dev(circle, "class", "svelte-32f9k0");
    			add_location(circle, file$s, 53, 1, 1939);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "indeterminate", /*indeterminate*/ ctx[6]);
    			toggle_class(svg, "svelte-32f9k0", true);
    			add_location(svg, file$s, 38, 0, 1590);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    			/*circle_binding*/ ctx[9](circle);
    			/*svg_binding*/ ctx[10](svg);

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[7].call(null, svg));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value, circumference*/ 33 && circle_stroke_dashoffset_value !== (circle_stroke_dashoffset_value = (100 - /*value*/ ctx[0]) / 100 * /*circumference*/ ctx[5])) {
    				attr_dev(circle, "stroke-dashoffset", circle_stroke_dashoffset_value);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				{ tabindex: "-1" },
    				dirty & /*className*/ 16 && svg_class_value !== (svg_class_value = "progress-ring " + /*className*/ ctx[4]) && { class: svg_class_value },
    				dirty & /*size*/ 8 && { width: /*size*/ ctx[3] },
    				dirty & /*size*/ 8 && { height: /*size*/ ctx[3] },
    				{ viewBox: "0 0 16 16" },
    				dirty & /*value*/ 1 && svg_role_value !== (svg_role_value = /*value*/ ctx[0] ? "progressbar" : "status") && { role: svg_role_value },
    				dirty & /*indeterminate*/ 64 && svg_aria_valuemin_value !== (svg_aria_valuemin_value = !/*indeterminate*/ ctx[6] ? 0 : undefined) && { "aria-valuemin": svg_aria_valuemin_value },
    				dirty & /*indeterminate*/ 64 && svg_aria_valuemax_value !== (svg_aria_valuemax_value = !/*indeterminate*/ ctx[6] ? 100 : undefined) && { "aria-valuemax": svg_aria_valuemax_value },
    				dirty & /*value*/ 1 && { "aria-valuenow": /*value*/ ctx[0] },
    				dirty & /*$$restProps*/ 256 && /*$$restProps*/ ctx[8]
    			]));

    			toggle_class(svg, "indeterminate", /*indeterminate*/ ctx[6]);
    			toggle_class(svg, "svelte-32f9k0", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			/*circle_binding*/ ctx[9](null);
    			/*svg_binding*/ ctx[10](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$s.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$s($$self, $$props, $$invalidate) {
    	let indeterminate;
    	const omit_props_names = ["value","size","class","element","circleElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressRing', slots, []);
    	let { value = undefined } = $$props;
    	let { size = 32 } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { circleElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component(), ["change"]);
    	const dispatch = createEventDispatcher();
    	let circumference;

    	function circle_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			circleElement = $$value;
    			$$invalidate(1, circleElement);
    		});
    	}

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    		if ('class' in $$new_props) $$invalidate(4, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(2, element = $$new_props.element);
    		if ('circleElement' in $$new_props) $$invalidate(1, circleElement = $$new_props.circleElement);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		createEventDispatcher,
    		get_current_component,
    		value,
    		size,
    		className,
    		element,
    		circleElement,
    		forwardEvents,
    		dispatch,
    		circumference,
    		indeterminate
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('size' in $$props) $$invalidate(3, size = $$new_props.size);
    		if ('className' in $$props) $$invalidate(4, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    		if ('circleElement' in $$props) $$invalidate(1, circleElement = $$new_props.circleElement);
    		if ('circumference' in $$props) $$invalidate(5, circumference = $$new_props.circumference);
    		if ('indeterminate' in $$props) $$invalidate(6, indeterminate = $$new_props.indeterminate);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			if (value < 0) {
    				$$invalidate(0, value = 0);
    			} else if (value > 100) {
    				$$invalidate(0, value = 100);
    			}
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			$$invalidate(6, indeterminate = typeof value === "undefined" || value === null || Number.isNaN(value));
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			dispatch("change", value);
    		}

    		if ($$self.$$.dirty & /*circleElement*/ 2) {
    			if (circleElement) $$invalidate(5, circumference = Math.PI * (circleElement.r.baseVal.value * 2));
    		}
    	};

    	return [
    		value,
    		circleElement,
    		element,
    		size,
    		className,
    		circumference,
    		indeterminate,
    		forwardEvents,
    		$$restProps,
    		circle_binding,
    		svg_binding
    	];
    }

    class ProgressRing extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$s, create_fragment$s, safe_not_equal, {
    			value: 0,
    			size: 3,
    			class: 4,
    			element: 2,
    			circleElement: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressRing",
    			options,
    			id: create_fragment$s.name
    		});
    	}

    	get value() {
    		throw new Error("<ProgressRing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ProgressRing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ProgressRing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ProgressRing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ProgressRing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ProgressRing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<ProgressRing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<ProgressRing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get circleElement() {
    		throw new Error("<ProgressRing>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set circleElement(value) {
    		throw new Error("<ProgressRing>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ProgressBar/ProgressBar.svelte generated by Svelte v3.59.2 */

    const file$r = "node_modules/fluent-svelte/ProgressBar/ProgressBar.svelte";

    // (39:1) {:else}
    function create_else_block$7(ctx) {
    	let rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "height", "3");
    			attr_dev(rect, "ry", "3");
    			attr_dev(rect, "class", "progress-bar-track svelte-1jjv56o");
    			add_location(rect, file$r, 39, 2, 1327);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			/*rect_binding_1*/ ctx[8](rect);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			/*rect_binding_1*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(39:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (30:1) {#if value}
    function create_if_block$j(ctx) {
    	let rect;

    	const block = {
    		c: function create() {
    			rect = svg_element("rect");
    			attr_dev(rect, "height", "1");
    			attr_dev(rect, "rx", "0.5");
    			attr_dev(rect, "y", "1");
    			attr_dev(rect, "width", "100%");
    			attr_dev(rect, "class", "progress-bar-rail svelte-1jjv56o");
    			add_location(rect, file$r, 30, 2, 1198);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, rect, anchor);
    			/*rect_binding*/ ctx[7](rect);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(rect);
    			/*rect_binding*/ ctx[7](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$j.name,
    		type: "if",
    		source: "(30:1) {#if value}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$r(ctx) {
    	let svg;
    	let rect;
    	let rect_width_value;
    	let svg_class_value;
    	let svg_aria_valuemin_value;
    	let svg_aria_valuemax_value;

    	function select_block_type(ctx, dirty) {
    		if (/*value*/ ctx[4]) return create_if_block$j;
    		return create_else_block$7;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	let svg_levels = [
    		{
    			class: svg_class_value = "progress-bar " + /*className*/ ctx[5]
    		},
    		{ role: "progressbar" },
    		{ width: "100%" },
    		{ height: "3" },
    		{
    			"aria-valuemin": svg_aria_valuemin_value = /*value*/ ctx[4] ? 0 : undefined
    		},
    		{
    			"aria-valuemax": svg_aria_valuemax_value = /*value*/ ctx[4] ? 100 : undefined
    		},
    		{ "aria-valuenow": /*value*/ ctx[4] },
    		/*$$restProps*/ ctx[6]
    	];

    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			if_block.c();
    			rect = svg_element("rect");
    			attr_dev(rect, "width", rect_width_value = /*value*/ ctx[4] ? `${/*value*/ ctx[4]}%` : undefined);
    			attr_dev(rect, "height", "3");
    			attr_dev(rect, "rx", "1.5");
    			attr_dev(rect, "class", "progress-bar-track svelte-1jjv56o");
    			add_location(rect, file$r, 41, 1, 1423);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "indeterminate", !/*value*/ ctx[4]);
    			toggle_class(svg, "svelte-1jjv56o", true);
    			add_location(svg, file$r, 17, 0, 924);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			if_block.m(svg, null);
    			append_dev(svg, rect);
    			/*rect_binding_2*/ ctx[9](rect);
    			/*svg_binding*/ ctx[10](svg);
    		},
    		p: function update(ctx, [dirty]) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(svg, rect);
    				}
    			}

    			if (dirty & /*value*/ 16 && rect_width_value !== (rect_width_value = /*value*/ ctx[4] ? `${/*value*/ ctx[4]}%` : undefined)) {
    				attr_dev(rect, "width", rect_width_value);
    			}

    			set_svg_attributes(svg, svg_data = get_spread_update(svg_levels, [
    				dirty & /*className*/ 32 && svg_class_value !== (svg_class_value = "progress-bar " + /*className*/ ctx[5]) && { class: svg_class_value },
    				{ role: "progressbar" },
    				{ width: "100%" },
    				{ height: "3" },
    				dirty & /*value*/ 16 && svg_aria_valuemin_value !== (svg_aria_valuemin_value = /*value*/ ctx[4] ? 0 : undefined) && { "aria-valuemin": svg_aria_valuemin_value },
    				dirty & /*value*/ 16 && svg_aria_valuemax_value !== (svg_aria_valuemax_value = /*value*/ ctx[4] ? 100 : undefined) && { "aria-valuemax": svg_aria_valuemax_value },
    				dirty & /*value*/ 16 && { "aria-valuenow": /*value*/ ctx[4] },
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6]
    			]));

    			toggle_class(svg, "indeterminate", !/*value*/ ctx[4]);
    			toggle_class(svg, "svelte-1jjv56o", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if_block.d();
    			/*rect_binding_2*/ ctx[9](null);
    			/*svg_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$r.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$r($$self, $$props, $$invalidate) {
    	const omit_props_names = ["value","class","element","railElement","trackElement","secondaryTrackElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ProgressBar', slots, []);
    	let { value = undefined } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { railElement = null } = $$props;
    	let { trackElement = null } = $$props;
    	let { secondaryTrackElement = null } = $$props;

    	function rect_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			railElement = $$value;
    			$$invalidate(1, railElement);
    		});
    	}

    	function rect_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			secondaryTrackElement = $$value;
    			$$invalidate(3, secondaryTrackElement);
    		});
    	}

    	function rect_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			trackElement = $$value;
    			$$invalidate(2, trackElement);
    		});
    	}

    	function svg_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('railElement' in $$new_props) $$invalidate(1, railElement = $$new_props.railElement);
    		if ('trackElement' in $$new_props) $$invalidate(2, trackElement = $$new_props.trackElement);
    		if ('secondaryTrackElement' in $$new_props) $$invalidate(3, secondaryTrackElement = $$new_props.secondaryTrackElement);
    	};

    	$$self.$capture_state = () => ({
    		value,
    		className,
    		element,
    		railElement,
    		trackElement,
    		secondaryTrackElement
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('railElement' in $$props) $$invalidate(1, railElement = $$new_props.railElement);
    		if ('trackElement' in $$props) $$invalidate(2, trackElement = $$new_props.trackElement);
    		if ('secondaryTrackElement' in $$props) $$invalidate(3, secondaryTrackElement = $$new_props.secondaryTrackElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		railElement,
    		trackElement,
    		secondaryTrackElement,
    		value,
    		className,
    		$$restProps,
    		rect_binding,
    		rect_binding_1,
    		rect_binding_2,
    		svg_binding
    	];
    }

    class ProgressBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$r, create_fragment$r, safe_not_equal, {
    			value: 4,
    			class: 5,
    			element: 0,
    			railElement: 1,
    			trackElement: 2,
    			secondaryTrackElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ProgressBar",
    			options,
    			id: create_fragment$r.name
    		});
    	}

    	get value() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get railElement() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set railElement(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackElement() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackElement(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get secondaryTrackElement() {
    		throw new Error("<ProgressBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set secondaryTrackElement(value) {
    		throw new Error("<ProgressBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/TextBox/TextBoxButton.svelte generated by Svelte v3.59.2 */
    const file$q = "node_modules/fluent-svelte/TextBox/TextBoxButton.svelte";

    function create_fragment$q(ctx) {
    	let button;
    	let button_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	let button_levels = [
    		{
    			class: button_class_value = "text-box-button " + /*className*/ ctx[2]
    		},
    		{ type: /*type*/ ctx[1] },
    		/*$$restProps*/ ctx[4]
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			toggle_class(button, "svelte-159a5xt", true);
    			add_location(button, file$q, 9, 0, 311);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[7](button);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[3].call(null, button));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*className*/ 4 && button_class_value !== (button_class_value = "text-box-button " + /*className*/ ctx[2])) && { class: button_class_value },
    				(!current || dirty & /*type*/ 2) && { type: /*type*/ ctx[1] },
    				dirty & /*$$restProps*/ 16 && /*$$restProps*/ ctx[4]
    			]));

    			toggle_class(button, "svelte-159a5xt", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$q.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$q($$self, $$props, $$invalidate) {
    	const omit_props_names = ["type","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextBoxButton', slots, ['default']);
    	let { type = "button" } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		get_current_component,
    		type,
    		className,
    		element,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		type,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$scope,
    		slots,
    		button_binding
    	];
    }

    class TextBoxButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$q, create_fragment$q, safe_not_equal, { type: 1, class: 2, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextBoxButton",
    			options,
    			id: create_fragment$q.name
    		});
    	}

    	get type() {
    		throw new Error("<TextBoxButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextBoxButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TextBoxButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TextBoxButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<TextBoxButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<TextBoxButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/TextBox/TextBox.svelte generated by Svelte v3.59.2 */
    const file$p = "node_modules/fluent-svelte/TextBox/TextBox.svelte";
    const get_buttons_slot_changes$2 = dirty => ({ value: dirty[0] & /*value*/ 1 });
    const get_buttons_slot_context$2 = ctx => ({ value: /*value*/ ctx[0] });

    // (115:28) 
    function create_if_block_15(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "week" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 115, 2, 5353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_11*/ ctx[45](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_11*/ ctx[44]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_11*/ ctx[45](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(115:28) ",
    		ctx
    	});

    	return block;
    }

    // (113:28) 
    function create_if_block_14(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "time" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 113, 2, 5230);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_10*/ ctx[43](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_10*/ ctx[42]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_10*/ ctx[43](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(113:28) ",
    		ctx
    	});

    	return block;
    }

    // (111:29) 
    function create_if_block_13(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "month" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 111, 2, 5106);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_9*/ ctx[41](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_9*/ ctx[40]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_9*/ ctx[41](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(111:29) ",
    		ctx
    	});

    	return block;
    }

    // (109:38) 
    function create_if_block_12(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "datetime-local" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 109, 2, 4972);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_8*/ ctx[39](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_8*/ ctx[38]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_8*/ ctx[39](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(109:38) ",
    		ctx
    	});

    	return block;
    }

    // (107:28) 
    function create_if_block_11(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "date" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 107, 2, 4839);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_7*/ ctx[37](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_7*/ ctx[36]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_7*/ ctx[37](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(107:28) ",
    		ctx
    	});

    	return block;
    }

    // (105:27) 
    function create_if_block_10(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "url" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 105, 2, 4717);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_6*/ ctx[35](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_6*/ ctx[34]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_6*/ ctx[35](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(105:27) ",
    		ctx
    	});

    	return block;
    }

    // (103:27) 
    function create_if_block_9(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "tel" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 103, 2, 4596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_5*/ ctx[33](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_5*/ ctx[32]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_5*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(103:27) ",
    		ctx
    	});

    	return block;
    }

    // (101:29) 
    function create_if_block_8(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "email" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 101, 2, 4473);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_4*/ ctx[31](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_4*/ ctx[30]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_4*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(101:29) ",
    		ctx
    	});

    	return block;
    }

    // (99:32) 
    function create_if_block_7(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "password" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 99, 2, 4345);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_3*/ ctx[29](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_3*/ ctx[28]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_3*/ ctx[29](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(99:32) ",
    		ctx
    	});

    	return block;
    }

    // (97:30) 
    function create_if_block_6$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "search" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 97, 2, 4216);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_2*/ ctx[27](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_2*/ ctx[26]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_2*/ ctx[27](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(97:30) ",
    		ctx
    	});

    	return block;
    }

    // (95:30) 
    function create_if_block_5$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "number" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 95, 2, 4089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding_1*/ ctx[25](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler_1*/ ctx[24]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && to_number(input.value) !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_1*/ ctx[25](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(95:30) ",
    		ctx
    	});

    	return block;
    }

    // (93:1) {#if type === "text"}
    function create_if_block_4$3(ctx) {
    	let input;
    	let mounted;
    	let dispose;
    	let input_levels = [{ type: "text" }, /*inputProps*/ ctx[18]];
    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			toggle_class(input, "svelte-8l6kgi", true);
    			add_location(input, file$p, 93, 2, 3964);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			set_input_value(input, /*value*/ ctx[0]);
    			/*input_binding*/ ctx[23](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[22]),
    					action_destroyer(/*forwardEvents*/ ctx[14].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			toggle_class(input, "svelte-8l6kgi", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[23](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(93:1) {#if type === \\\"text\\\"}",
    		ctx
    	});

    	return block;
    }

    // (120:2) {#if !disabled}
    function create_if_block$i(ctx) {
    	let t0;
    	let t1;
    	let if_block2_anchor;
    	let current;
    	let if_block0 = /*clearButton*/ ctx[8] && /*value*/ ctx[0] && !/*readonly*/ ctx[11] && create_if_block_3$4(ctx);
    	let if_block1 = /*type*/ ctx[7] === "search" && /*searchButton*/ ctx[9] && create_if_block_2$8(ctx);
    	let if_block2 = /*type*/ ctx[7] === "password" && /*value*/ ctx[0] && /*revealButton*/ ctx[10] && create_if_block_1$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			if_block2_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block2) if_block2.m(target, anchor);
    			insert_dev(target, if_block2_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*clearButton*/ ctx[8] && /*value*/ ctx[0] && !/*readonly*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*clearButton, value, readonly*/ 2305) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t0.parentNode, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*type*/ ctx[7] === "search" && /*searchButton*/ ctx[9]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*type, searchButton*/ 640) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t1.parentNode, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*type*/ ctx[7] === "password" && /*value*/ ctx[0] && /*revealButton*/ ctx[10]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*type, value, revealButton*/ 1153) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$b(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block2) if_block2.d(detaching);
    			if (detaching) detach_dev(if_block2_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$i.name,
    		type: "if",
    		source: "(120:2) {#if !disabled}",
    		ctx
    	});

    	return block;
    }

    // (121:3) {#if clearButton && value && !readonly}
    function create_if_block_3$4(ctx) {
    	let textboxbutton;
    	let updating_element;
    	let current;

    	function textboxbutton_element_binding(value) {
    		/*textboxbutton_element_binding*/ ctx[46](value);
    	}

    	let textboxbutton_props = {
    		class: "text-box-clear-button",
    		"aria-label": "Clear value",
    		$$slots: { default: [create_default_slot_2$5] },
    		$$scope: { ctx }
    	};

    	if (/*clearButtonElement*/ ctx[4] !== void 0) {
    		textboxbutton_props.element = /*clearButtonElement*/ ctx[4];
    	}

    	textboxbutton = new TextBoxButton({
    			props: textboxbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton, 'element', textboxbutton_element_binding));
    	textboxbutton.$on("click", /*handleClear*/ ctx[15]);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton_changes = {};

    			if (dirty[1] & /*$$scope*/ 1048576) {
    				textboxbutton_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*clearButtonElement*/ 16) {
    				updating_element = true;
    				textboxbutton_changes.element = /*clearButtonElement*/ ctx[4];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton.$set(textboxbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(121:3) {#if clearButton && value && !readonly}",
    		ctx
    	});

    	return block;
    }

    // (122:4) <TextBoxButton      class="text-box-clear-button"      aria-label="Clear value"      on:click={handleClear}      bind:element={clearButtonElement}     >
    function create_default_slot_2$5(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M2.08859 2.21569L2.14645 2.14645C2.32001 1.97288 2.58944 1.9536 2.78431 2.08859L2.85355 2.14645L6 5.293L9.14645 2.14645C9.34171 1.95118 9.65829 1.95118 9.85355 2.14645C10.0488 2.34171 10.0488 2.65829 9.85355 2.85355L6.707 6L9.85355 9.14645C10.0271 9.32001 10.0464 9.58944 9.91141 9.78431L9.85355 9.85355C9.67999 10.0271 9.41056 10.0464 9.21569 9.91141L9.14645 9.85355L6 6.707L2.85355 9.85355C2.65829 10.0488 2.34171 10.0488 2.14645 9.85355C1.95118 9.65829 1.95118 9.34171 2.14645 9.14645L5.293 6L2.14645 2.85355C1.97288 2.67999 1.9536 2.41056 2.08859 2.21569L2.14645 2.14645L2.08859 2.21569Z");
    			add_location(path, file$p, 134, 6, 5924);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			add_location(svg, file$p, 127, 5, 5779);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$5.name,
    		type: "slot",
    		source: "(122:4) <TextBoxButton      class=\\\"text-box-clear-button\\\"      aria-label=\\\"Clear value\\\"      on:click={handleClear}      bind:element={clearButtonElement}     >",
    		ctx
    	});

    	return block;
    }

    // (142:3) {#if type === "search" && searchButton}
    function create_if_block_2$8(ctx) {
    	let textboxbutton;
    	let updating_element;
    	let current;

    	function textboxbutton_element_binding_1(value) {
    		/*textboxbutton_element_binding_1*/ ctx[47](value);
    	}

    	let textboxbutton_props = {
    		"aria-label": "Search",
    		$$slots: { default: [create_default_slot_1$8] },
    		$$scope: { ctx }
    	};

    	if (/*searchButtonElement*/ ctx[5] !== void 0) {
    		textboxbutton_props.element = /*searchButtonElement*/ ctx[5];
    	}

    	textboxbutton = new TextBoxButton({
    			props: textboxbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton, 'element', textboxbutton_element_binding_1));
    	textboxbutton.$on("click", /*handleSearch*/ ctx[16]);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton_changes = {};

    			if (dirty[1] & /*$$scope*/ 1048576) {
    				textboxbutton_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*searchButtonElement*/ 32) {
    				updating_element = true;
    				textboxbutton_changes.element = /*searchButtonElement*/ ctx[5];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton.$set(textboxbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$8.name,
    		type: "if",
    		source: "(142:3) {#if type === \\\"search\\\" && searchButton}",
    		ctx
    	});

    	return block;
    }

    // (143:4) <TextBoxButton      aria-label="Search"      on:click={handleSearch}      bind:element={searchButtonElement}     >
    function create_default_slot_1$8(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M5.00038 1C2.79103 1 1 2.7909 1 5.00008C1 7.20927 2.79103 9.00017 5.00038 9.00017C5.92463 9.00017 6.77568 8.68675 7.45302 8.1604L10.1464 10.8536C10.3416 11.0488 10.6583 11.0488 10.8535 10.8536C11.0488 10.6583 11.0488 10.3417 10.8535 10.1464L8.16028 7.45337C8.68705 6.77595 9.00075 5.92465 9.00075 5.00008C9.00075 2.7909 7.20972 1 5.00038 1ZM2.00009 5.00008C2.00009 3.34319 3.34337 2.00002 5.00038 2.00002C6.65739 2.00002 8.00066 3.34319 8.00066 5.00008C8.00066 6.65697 6.65739 8.00015 5.00038 8.00015C3.34337 8.00015 2.00009 6.65697 2.00009 5.00008Z");
    			attr_dev(path, "fill", "currentColor");
    			add_location(path, file$p, 154, 6, 6923);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			add_location(svg, file$p, 147, 5, 6778);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$8.name,
    		type: "slot",
    		source: "(143:4) <TextBoxButton      aria-label=\\\"Search\\\"      on:click={handleSearch}      bind:element={searchButtonElement}     >",
    		ctx
    	});

    	return block;
    }

    // (162:3) {#if type === "password" && value && revealButton}
    function create_if_block_1$b(ctx) {
    	let textboxbutton;
    	let updating_element;
    	let current;

    	function textboxbutton_element_binding_2(value) {
    		/*textboxbutton_element_binding_2*/ ctx[48](value);
    	}

    	let textboxbutton_props = {
    		"aria-label": "Reveal password",
    		$$slots: { default: [create_default_slot$f] },
    		$$scope: { ctx }
    	};

    	if (/*revealButtonElement*/ ctx[6] !== void 0) {
    		textboxbutton_props.element = /*revealButtonElement*/ ctx[6];
    	}

    	textboxbutton = new TextBoxButton({
    			props: textboxbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton, 'element', textboxbutton_element_binding_2));
    	textboxbutton.$on("mousedown", /*handleReveal*/ ctx[17]);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton_changes = {};

    			if (dirty[1] & /*$$scope*/ 1048576) {
    				textboxbutton_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*revealButtonElement*/ 64) {
    				updating_element = true;
    				textboxbutton_changes.element = /*revealButtonElement*/ ctx[6];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton.$set(textboxbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$b.name,
    		type: "if",
    		source: "(162:3) {#if type === \\\"password\\\" && value && revealButton}",
    		ctx
    	});

    	return block;
    }

    // (163:4) <TextBoxButton      aria-label="Reveal password"      on:mousedown={handleReveal}      bind:element={revealButtonElement}     >
    function create_default_slot$f(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M0,554.5C0,550.833 0.5,547.167 1.5,543.5C11.5,505.833 25.75,470.417 44.25,437.25C62.75,404.083 84.5833,373.667 109.75,346C134.917,318.333 162.75,293.667 193.25,272C223.75,250.333 256.25,231.917 290.75,216.75C325.25,201.583 361.167,190.083 398.5,182.25C435.833,174.417 473.667,170.5 512,170.5C550,170.5 587.583,174.417 624.75,182.25C661.917,190.083 697.75,201.5 732.25,216.5C766.75,231.5 799.417,249.917 830.25,271.75C861.083,293.583 889.083,318.25 914.25,345.75C939.417,373.25 961.25,403.5 979.75,436.5C998.25,469.5 1012.5,504.833 1022.5,542.5C1023.5,546.167 1024,550 1024,554C1024,566 1019.92,576.083 1011.75,584.25C1003.58,592.417 993.5,596.5 981.5,596.5C971.5,596.5 962.917,593.667 955.75,588C948.583,582.333 943.333,574.833 940,565.5C937,556.167 934.083,547.5 931.25,539.5C928.417,531.5 925.5,523.583 922.5,515.75C919.5,507.917 916.167,500.167 912.5,492.5C908.833,484.833 904.333,476.667 899,468C879.333,435 855.583,405.417 827.75,379.25C799.917,353.083 769.333,330.917 736,312.75C702.667,294.583 667.417,280.583 630.25,270.75C593.083,260.917 555.5,256 517.5,256L506.5,256C468.5,256 430.917,260.917 393.75,270.75C356.583,280.583 321.333,294.667 288,313C254.667,331.333 224,353.583 196,379.75C168,405.917 144.333,435.5 125,468.5C119.667,477.167 115.167,485.417 111.5,493.25C107.833,501.083 104.5,508.833 101.5,516.5C98.5,524.167 95.5833,532 92.75,540C89.9167,548 87,556.667 84,566C80.6667,575.333 75.5,582.917 68.5,588.75C61.5,594.583 52.8333,597.5 42.5,597.5C36.8333,597.5 31.4167,596.333 26.25,594C21.0833,591.667 16.5833,588.583 12.75,584.75C8.91667,580.917 5.83333,576.417 3.5,571.25C1.16667,566.083 0,560.5 0,554.5ZM256,597.5L256,592.5C256,557.833 262.917,525.25 276.75,494.75C290.583,464.25 309.25,437.667 332.75,415C356.25,392.333 383.417,374.417 414.25,361.25C445.083,348.083 477.667,341.5 512,341.5C547.333,341.5 580.583,348.167 611.75,361.5C642.917,374.833 670.083,393.083 693.25,416.25C716.417,439.417 734.667,466.583 748,497.75C761.333,528.917 768,562.167 768,597.5C768,632.833 761.333,666.083 748,697.25C734.667,728.417 716.417,755.583 693.25,778.75C670.083,801.917 642.917,820.167 611.75,833.5C580.583,846.833 547.333,853.5 512,853.5C476.667,853.5 443.417,846.833 412.25,833.5C381.083,820.167 353.917,801.917 330.75,778.75C307.583,755.583 289.333,728.417 276,697.25C262.667,666.083 256,632.833 256,597.5ZM682.5,597.5L682.5,594C682.5,571 677.917,549.333 668.75,529C659.583,508.667 647.167,490.917 631.5,475.75C615.833,460.583 597.667,448.583 577,439.75C556.333,430.917 534.667,426.5 512,426.5C488.333,426.5 466.167,431 445.5,440C424.833,449 406.833,461.25 391.5,476.75C376.167,492.25 364,510.417 355,531.25C346,552.083 341.5,574.167 341.5,597.5C341.5,621.167 346,643.333 355,664C364,684.667 376.167,702.667 391.5,718C406.833,733.333 424.833,745.5 445.5,754.5C466.167,763.5 488.333,768 512,768C535.333,768 557.417,763.5 578.25,754.5C599.083,745.5 617.167,733.333 632.5,718C647.833,702.667 660,684.667 669,664C678,643.333 682.5,621.167 682.5,597.5Z");
    			attr_dev(path, "fill", "currentColor");
    			add_location(path, file$p, 174, 6, 7909);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "10");
    			attr_dev(svg, "height", "10");
    			attr_dev(svg, "viewBox", "0 171 1024 683");
    			add_location(svg, file$p, 167, 5, 7759);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$f.name,
    		type: "slot",
    		source: "(163:4) <TextBoxButton      aria-label=\\\"Reveal password\\\"      on:mousedown={handleReveal}      bind:element={revealButtonElement}     >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$p(ctx) {
    	let div2;
    	let t0;
    	let div0;
    	let t1;
    	let div1;
    	let t2;
    	let t3;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[7] === "text") return create_if_block_4$3;
    		if (/*type*/ ctx[7] === "number") return create_if_block_5$1;
    		if (/*type*/ ctx[7] === "search") return create_if_block_6$1;
    		if (/*type*/ ctx[7] === "password") return create_if_block_7;
    		if (/*type*/ ctx[7] === "email") return create_if_block_8;
    		if (/*type*/ ctx[7] === "tel") return create_if_block_9;
    		if (/*type*/ ctx[7] === "url") return create_if_block_10;
    		if (/*type*/ ctx[7] === "date") return create_if_block_11;
    		if (/*type*/ ctx[7] === "datetime-local") return create_if_block_12;
    		if (/*type*/ ctx[7] === "month") return create_if_block_13;
    		if (/*type*/ ctx[7] === "time") return create_if_block_14;
    		if (/*type*/ ctx[7] === "week") return create_if_block_15;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);
    	let if_block1 = !/*disabled*/ ctx[12] && create_if_block$i(ctx);
    	const buttons_slot_template = /*#slots*/ ctx[20].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[51], get_buttons_slot_context$2);
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[51], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (buttons_slot) buttons_slot.c();
    			t3 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "text-box-underline svelte-8l6kgi");
    			add_location(div0, file$p, 117, 1, 5453);
    			attr_dev(div1, "class", "text-box-buttons svelte-8l6kgi");
    			add_location(div1, file$p, 118, 1, 5489);
    			attr_dev(div2, "class", div2_class_value = "text-box-container " + /*className*/ ctx[13] + " svelte-8l6kgi");
    			toggle_class(div2, "disabled", /*disabled*/ ctx[12]);
    			add_location(div2, file$p, 83, 0, 3639);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);

    			if (buttons_slot) {
    				buttons_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[49](div1);
    			append_dev(div2, t3);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			/*div2_binding*/ ctx[50](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(externalMouseEvents.call(null, div2, { type: "mousedown" })),
    					listen_dev(div2, "outermousedown", /*outermousedown_handler*/ ctx[21], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div2, t0);
    				}
    			}

    			if (!/*disabled*/ ctx[12]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*disabled*/ 4096) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$i(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (buttons_slot) {
    				if (buttons_slot.p && (!current || dirty[0] & /*value*/ 1 | dirty[1] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						buttons_slot,
    						buttons_slot_template,
    						ctx,
    						/*$$scope*/ ctx[51],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[51])
    						: get_slot_changes(buttons_slot_template, /*$$scope*/ ctx[51], dirty, get_buttons_slot_changes$2),
    						get_buttons_slot_context$2
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[51],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[51])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[51], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty[0] & /*className*/ 8192 && div2_class_value !== (div2_class_value = "text-box-container " + /*className*/ ctx[13] + " svelte-8l6kgi")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (!current || dirty[0] & /*className, disabled*/ 12288) {
    				toggle_class(div2, "disabled", /*disabled*/ ctx[12]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(buttons_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(buttons_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);

    			if (if_block0) {
    				if_block0.d();
    			}

    			if (if_block1) if_block1.d();
    			if (buttons_slot) buttons_slot.d(detaching);
    			/*div1_binding*/ ctx[49](null);
    			if (default_slot) default_slot.d(detaching);
    			/*div2_binding*/ ctx[50](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$p.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$p($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","type","placeholder","clearButton","searchButton","revealButton","readonly","disabled","class","inputElement","containerElement","buttonsContainerElement","clearButtonElement","searchButtonElement","revealButtonElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextBox', slots, ['buttons','default']);
    	let { value = "" } = $$props;
    	let { type = "text" } = $$props;
    	let { placeholder = undefined } = $$props;
    	let { clearButton = true } = $$props;
    	let { searchButton = true } = $$props;
    	let { revealButton = true } = $$props;
    	let { readonly = false } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	let { buttonsContainerElement = null } = $$props;
    	let { clearButtonElement = null } = $$props;
    	let { searchButtonElement = null } = $$props;
    	let { revealButtonElement = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const forwardEvents = createEventForwarder(get_current_component(), ["clear", "search", "reveal", "outermousedown"]);

    	function handleClear(event) {
    		dispatch("clear", event);
    		inputElement.focus();
    		$$invalidate(0, value = "");
    	}

    	function handleSearch(event) {
    		dispatch("search", event);
    		inputElement.focus();
    	}

    	function handleReveal(event) {
    		inputElement.focus();
    		inputElement.setAttribute("type", "text");
    		dispatch("reveal", event);
    		let revealButtonMouseDown = true;

    		const hidePassword = () => {
    			if (!revealButtonMouseDown) return;
    			inputElement.focus();
    			revealButtonMouseDown = false;
    			inputElement.setAttribute("type", "password");
    			window.removeEventListener("mouseup", hidePassword);
    		};

    		window.addEventListener("mouseup", hidePassword);
    	}

    	const inputProps = {
    		class: "text-box",
    		disabled: disabled || undefined,
    		readonly: readonly || undefined,
    		placeholder: placeholder || undefined,
    		...$$restProps
    	};

    	function outermousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_1() {
    		value = to_number(this.value);
    		$$invalidate(0, value);
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_2() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_3() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_3($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_4() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_4($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_5() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_5($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_6() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_6($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_7() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_7($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_8() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_8($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_9() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_9($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_10() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_10($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function input_input_handler_11() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	function input_binding_11($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(1, inputElement);
    		});
    	}

    	function textboxbutton_element_binding(value) {
    		clearButtonElement = value;
    		$$invalidate(4, clearButtonElement);
    	}

    	function textboxbutton_element_binding_1(value) {
    		searchButtonElement = value;
    		$$invalidate(5, searchButtonElement);
    	}

    	function textboxbutton_element_binding_2(value) {
    		revealButtonElement = value;
    		$$invalidate(6, revealButtonElement);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			buttonsContainerElement = $$value;
    			$$invalidate(3, buttonsContainerElement);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(2, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(53, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$new_props) $$invalidate(7, type = $$new_props.type);
    		if ('placeholder' in $$new_props) $$invalidate(19, placeholder = $$new_props.placeholder);
    		if ('clearButton' in $$new_props) $$invalidate(8, clearButton = $$new_props.clearButton);
    		if ('searchButton' in $$new_props) $$invalidate(9, searchButton = $$new_props.searchButton);
    		if ('revealButton' in $$new_props) $$invalidate(10, revealButton = $$new_props.revealButton);
    		if ('readonly' in $$new_props) $$invalidate(11, readonly = $$new_props.readonly);
    		if ('disabled' in $$new_props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(13, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$new_props) $$invalidate(3, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('clearButtonElement' in $$new_props) $$invalidate(4, clearButtonElement = $$new_props.clearButtonElement);
    		if ('searchButtonElement' in $$new_props) $$invalidate(5, searchButtonElement = $$new_props.searchButtonElement);
    		if ('revealButtonElement' in $$new_props) $$invalidate(6, revealButtonElement = $$new_props.revealButtonElement);
    		if ('$$scope' in $$new_props) $$invalidate(51, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		get_current_component,
    		externalMouseEvents,
    		createEventForwarder,
    		TextBoxButton,
    		value,
    		type,
    		placeholder,
    		clearButton,
    		searchButton,
    		revealButton,
    		readonly,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		clearButtonElement,
    		searchButtonElement,
    		revealButtonElement,
    		dispatch,
    		forwardEvents,
    		handleClear,
    		handleSearch,
    		handleReveal,
    		inputProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$props) $$invalidate(7, type = $$new_props.type);
    		if ('placeholder' in $$props) $$invalidate(19, placeholder = $$new_props.placeholder);
    		if ('clearButton' in $$props) $$invalidate(8, clearButton = $$new_props.clearButton);
    		if ('searchButton' in $$props) $$invalidate(9, searchButton = $$new_props.searchButton);
    		if ('revealButton' in $$props) $$invalidate(10, revealButton = $$new_props.revealButton);
    		if ('readonly' in $$props) $$invalidate(11, readonly = $$new_props.readonly);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(13, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$props) $$invalidate(3, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('clearButtonElement' in $$props) $$invalidate(4, clearButtonElement = $$new_props.clearButtonElement);
    		if ('searchButtonElement' in $$props) $$invalidate(5, searchButtonElement = $$new_props.searchButtonElement);
    		if ('revealButtonElement' in $$props) $$invalidate(6, revealButtonElement = $$new_props.revealButtonElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		clearButtonElement,
    		searchButtonElement,
    		revealButtonElement,
    		type,
    		clearButton,
    		searchButton,
    		revealButton,
    		readonly,
    		disabled,
    		className,
    		forwardEvents,
    		handleClear,
    		handleSearch,
    		handleReveal,
    		inputProps,
    		placeholder,
    		slots,
    		outermousedown_handler,
    		input_input_handler,
    		input_binding,
    		input_input_handler_1,
    		input_binding_1,
    		input_input_handler_2,
    		input_binding_2,
    		input_input_handler_3,
    		input_binding_3,
    		input_input_handler_4,
    		input_binding_4,
    		input_input_handler_5,
    		input_binding_5,
    		input_input_handler_6,
    		input_binding_6,
    		input_input_handler_7,
    		input_binding_7,
    		input_input_handler_8,
    		input_binding_8,
    		input_input_handler_9,
    		input_binding_9,
    		input_input_handler_10,
    		input_binding_10,
    		input_input_handler_11,
    		input_binding_11,
    		textboxbutton_element_binding,
    		textboxbutton_element_binding_1,
    		textboxbutton_element_binding_2,
    		div1_binding,
    		div2_binding,
    		$$scope
    	];
    }

    class TextBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$p,
    			create_fragment$p,
    			safe_not_equal,
    			{
    				value: 0,
    				type: 7,
    				placeholder: 19,
    				clearButton: 8,
    				searchButton: 9,
    				revealButton: 10,
    				readonly: 11,
    				disabled: 12,
    				class: 13,
    				inputElement: 1,
    				containerElement: 2,
    				buttonsContainerElement: 3,
    				clearButtonElement: 4,
    				searchButtonElement: 5,
    				revealButtonElement: 6
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextBox",
    			options,
    			id: create_fragment$p.name
    		});
    	}

    	get value() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearButton() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearButton(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchButton() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchButton(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get revealButton() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set revealButton(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get readonly() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set readonly(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonsContainerElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonsContainerElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearButtonElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearButtonElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchButtonElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchButtonElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get revealButtonElement() {
    		throw new Error("<TextBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set revealButtonElement(value) {
    		throw new Error("<TextBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ComboBox/ComboBox.svelte generated by Svelte v3.59.2 */
    const file$o = "node_modules/fluent-svelte/ComboBox/ComboBox.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	child_ctx[54] = i;
    	return child_ctx;
    }

    // (249:1) {:else}
    function create_else_block$6(ctx) {
    	let button;
    	let updating_element;
    	let current;

    	function button_element_binding(value) {
    		/*button_element_binding*/ ctx[38](value);
    	}

    	let button_props = {
    		type: "button",
    		class: "combo-box-button",
    		id: /*buttonId*/ ctx[18],
    		"aria-labelledby": /*buttonId*/ ctx[18],
    		"aria-haspopup": /*open*/ ctx[1] ? "listbox" : undefined,
    		"aria-controls": /*dropdownId*/ ctx[19],
    		disabled: /*disabled*/ ctx[11],
    		$$slots: { default: [create_default_slot_2$4] },
    		$$scope: { ctx }
    	};

    	if (/*buttonElement*/ ctx[7] !== void 0) {
    		button_props.element = /*buttonElement*/ ctx[7];
    	}

    	button = new Button({ props: button_props, $$inline: true });
    	binding_callbacks.push(() => bind(button, 'element', button_element_binding));
    	button.$on("keydown", /*handleKeyboardNavigation*/ ctx[22]);
    	button.$on("keydown", /*keydown_handler_1*/ ctx[39]);
    	button.$on("click", /*openMenu*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty[0] & /*open*/ 2) button_changes["aria-haspopup"] = /*open*/ ctx[1] ? "listbox" : undefined;
    			if (dirty[0] & /*disabled*/ 2048) button_changes.disabled = /*disabled*/ ctx[11];

    			if (dirty[0] & /*selection, placeholder*/ 8448 | dirty[1] & /*$$scope*/ 65536) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*buttonElement*/ 128) {
    				updating_element = true;
    				button_changes.element = /*buttonElement*/ ctx[7];
    				add_flush_callback(() => updating_element = false);
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(249:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (202:1) {#if editable}
    function create_if_block_2$7(ctx) {
    	let textbox;
    	let updating_value;
    	let updating_inputElement;
    	let current;

    	function textbox_value_binding(value) {
    		/*textbox_value_binding*/ ctx[32](value);
    	}

    	function textbox_inputElement_binding(value) {
    		/*textbox_inputElement_binding*/ ctx[33](value);
    	}

    	let textbox_props = {
    		clearButton: false,
    		class: "combo-box-text-box",
    		role: "combobox",
    		"aria-activedescendant": /*inputFocused*/ ctx[14],
    		"aria-autocomplete": "both",
    		"aria-controls": /*dropdownId*/ ctx[19],
    		"aria-expanded": /*open*/ ctx[1],
    		"aria-haspopup": /*open*/ ctx[1] ? "listbox" : undefined,
    		placeholder: /*placeholder*/ ctx[8],
    		disabled: /*disabled*/ ctx[11],
    		$$slots: { buttons: [create_buttons_slot$2] },
    		$$scope: { ctx }
    	};

    	if (/*searchValue*/ ctx[3] !== void 0) {
    		textbox_props.value = /*searchValue*/ ctx[3];
    	}

    	if (/*searchInputElement*/ ctx[5] !== void 0) {
    		textbox_props.inputElement = /*searchInputElement*/ ctx[5];
    	}

    	textbox = new TextBox({ props: textbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox, 'value', textbox_value_binding));
    	binding_callbacks.push(() => bind(textbox, 'inputElement', textbox_inputElement_binding));
    	textbox.$on("keydown", /*handleKeyboardNavigation*/ ctx[22]);
    	textbox.$on("input", /*handleInput*/ ctx[25]);
    	textbox.$on("focus", /*handleInputFocus*/ ctx[23]);
    	textbox.$on("blur", /*handleInputBlur*/ ctx[24]);
    	textbox.$on("change", /*change_handler*/ ctx[34]);
    	textbox.$on("input", /*input_handler*/ ctx[35]);
    	textbox.$on("beforeinput", /*beforeinput_handler*/ ctx[36]);
    	textbox.$on("keydown", /*keydown_handler*/ ctx[37]);

    	const block = {
    		c: function create() {
    			create_component(textbox.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textbox_changes = {};
    			if (dirty[0] & /*inputFocused*/ 16384) textbox_changes["aria-activedescendant"] = /*inputFocused*/ ctx[14];
    			if (dirty[0] & /*open*/ 2) textbox_changes["aria-expanded"] = /*open*/ ctx[1];
    			if (dirty[0] & /*open*/ 2) textbox_changes["aria-haspopup"] = /*open*/ ctx[1] ? "listbox" : undefined;
    			if (dirty[0] & /*placeholder*/ 256) textbox_changes.placeholder = /*placeholder*/ ctx[8];
    			if (dirty[0] & /*disabled*/ 2048) textbox_changes.disabled = /*disabled*/ ctx[11];

    			if (dirty[0] & /*open, buttonElement*/ 130 | dirty[1] & /*$$scope*/ 65536) {
    				textbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value && dirty[0] & /*searchValue*/ 8) {
    				updating_value = true;
    				textbox_changes.value = /*searchValue*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating_inputElement && dirty[0] & /*searchInputElement*/ 32) {
    				updating_inputElement = true;
    				textbox_changes.inputElement = /*searchInputElement*/ ctx[5];
    				add_flush_callback(() => updating_inputElement = false);
    			}

    			textbox.$set(textbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$7.name,
    		type: "if",
    		source: "(202:1) {#if editable}",
    		ctx
    	});

    	return block;
    }

    // (250:2) <Button    type="button"    class="combo-box-button"    id={buttonId}    aria-labelledby={buttonId}    aria-haspopup={open ? "listbox" : undefined}    aria-controls={dropdownId}    on:keydown={handleKeyboardNavigation}    on:keydown    on:click={openMenu}    bind:element={buttonElement}    {disabled}   >
    function create_default_slot_2$4(ctx) {
    	let span;
    	let t0_value = (/*selection*/ ctx[13]?.name || /*placeholder*/ ctx[8]) + "";
    	let t0;
    	let t1;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(span, "class", "combo-box-label svelte-1iqhotm");
    			toggle_class(span, "placeholder", !/*selection*/ ctx[13]);
    			add_location(span, file$o, 262, 3, 9699);
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z");
    			add_location(path, file$o, 273, 4, 9970);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "combo-box-icon svelte-1iqhotm");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "48");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			add_location(svg, file$o, 265, 3, 9812);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*selection, placeholder*/ 8448 && t0_value !== (t0_value = (/*selection*/ ctx[13]?.name || /*placeholder*/ ctx[8]) + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*selection*/ 8192) {
    				toggle_class(span, "placeholder", !/*selection*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$4.name,
    		type: "slot",
    		source: "(250:2) <Button    type=\\\"button\\\"    class=\\\"combo-box-button\\\"    id={buttonId}    aria-labelledby={buttonId}    aria-haspopup={open ? \\\"listbox\\\" : undefined}    aria-controls={dropdownId}    on:keydown={handleKeyboardNavigation}    on:keydown    on:click={openMenu}    bind:element={buttonElement}    {disabled}   >",
    		ctx
    	});

    	return block;
    }

    // (225:3) <TextBoxButton     aria-expanded={open}     aria-label="Open dropdown"     aria-controls={dropdownId}     class="combo-box-dropdown-button"     on:click={openMenu}     bind:element={buttonElement}     slot="buttons"    >
    function create_default_slot_1$7(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M8.36612 16.1161C7.87796 16.6043 7.87796 17.3957 8.36612 17.8839L23.1161 32.6339C23.6043 33.122 24.3957 33.122 24.8839 32.6339L39.6339 17.8839C40.122 17.3957 40.122 16.6043 39.6339 16.1161C39.1457 15.628 38.3543 15.628 37.8661 16.1161L24 29.9822L10.1339 16.1161C9.64573 15.628 8.85427 15.628 8.36612 16.1161Z");
    			add_location(path, file$o, 241, 5, 8976);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "class", "combo-box-icon svelte-1iqhotm");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "48");
    			attr_dev(svg, "height", "48");
    			attr_dev(svg, "viewBox", "0 0 48 48");
    			add_location(svg, file$o, 233, 4, 8810);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$7.name,
    		type: "slot",
    		source: "(225:3) <TextBoxButton     aria-expanded={open}     aria-label=\\\"Open dropdown\\\"     aria-controls={dropdownId}     class=\\\"combo-box-dropdown-button\\\"     on:click={openMenu}     bind:element={buttonElement}     slot=\\\"buttons\\\"    >",
    		ctx
    	});

    	return block;
    }

    // (225:3) 
    function create_buttons_slot$2(ctx) {
    	let textboxbutton;
    	let updating_element;
    	let current;

    	function textboxbutton_element_binding(value) {
    		/*textboxbutton_element_binding*/ ctx[31](value);
    	}

    	let textboxbutton_props = {
    		"aria-expanded": /*open*/ ctx[1],
    		"aria-label": "Open dropdown",
    		"aria-controls": /*dropdownId*/ ctx[19],
    		class: "combo-box-dropdown-button",
    		slot: "buttons",
    		$$slots: { default: [create_default_slot_1$7] },
    		$$scope: { ctx }
    	};

    	if (/*buttonElement*/ ctx[7] !== void 0) {
    		textboxbutton_props.element = /*buttonElement*/ ctx[7];
    	}

    	textboxbutton = new TextBoxButton({
    			props: textboxbutton_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton, 'element', textboxbutton_element_binding));
    	textboxbutton.$on("click", /*openMenu*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton_changes = {};
    			if (dirty[0] & /*open*/ 2) textboxbutton_changes["aria-expanded"] = /*open*/ ctx[1];

    			if (dirty[1] & /*$$scope*/ 65536) {
    				textboxbutton_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*buttonElement*/ 128) {
    				updating_element = true;
    				textboxbutton_changes.element = /*buttonElement*/ ctx[7];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton.$set(textboxbutton_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$2.name,
    		type: "slot",
    		source: "(225:3) ",
    		ctx
    	});

    	return block;
    }

    // (281:1) {#if !disabled && items.length > 0}
    function create_if_block$h(ctx) {
    	let t0;
    	let input;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[1] && create_if_block_1$a(ctx);
    	const default_slot_template = /*#slots*/ ctx[27].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[47], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t0 = space();
    			input = element("input");
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(input, "type", "hidden");
    			attr_dev(input, "aria-hidden", "true");
    			add_location(input, file$o, 311, 2, 11142);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, input, anchor);
    			/*input_binding*/ ctx[43](input);
    			set_input_value(input, /*value*/ ctx[0]);
    			insert_dev(target, t1, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "input", /*input_input_handler*/ ctx[44]),
    					listen_dev(input, "change", /*change_handler_1*/ ctx[28], false, false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[29], false, false, false, false),
    					listen_dev(input, "beforeinput", /*beforeinput_handler_1*/ ctx[30], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*open*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$a(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t0.parentNode, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*value*/ 1) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 65536)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[47],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[47])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[47], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[43](null);
    			if (detaching) detach_dev(t1);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$h.name,
    		type: "if",
    		source: "(281:1) {#if !disabled && items.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (282:2) {#if open}
    function create_if_block_1$a(ctx) {
    	let ul;
    	let ul_aria_activedescendant_value;
    	let ul_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*items*/ ctx[9];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", /*dropdownId*/ ctx[19]);
    			attr_dev(ul, "aria-labelledby", /*buttonId*/ ctx[18]);

    			attr_dev(ul, "aria-activedescendant", ul_aria_activedescendant_value = /*editable*/ ctx[10]
    			? undefined
    			: `${/*dropdownId*/ ctx[19]}-item-${/*items*/ ctx[9].indexOf(/*selection*/ ctx[13])}`);

    			attr_dev(ul, "role", "listbox");

    			attr_dev(ul, "class", ul_class_value = "combo-box-dropdown direction-" + (!/*editable*/ ctx[10]
    			? /*menuGrowDirection*/ ctx[16] ?? 'center'
    			: 'top') + " svelte-1iqhotm");

    			set_style(ul, "--fds-menu-offset", /*menuOffset*/ ctx[15] + "px");
    			add_location(ul, file$o, 282, 3, 10408);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			/*ul_binding*/ ctx[41](ul);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(ul, "blur", /*blur_handler*/ ctx[42], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items, value, dropdownId, handleKeyboardNavigation, selectItem*/ 5767681) {
    				each_value = /*items*/ ctx[9];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*editable, items, selection*/ 9728 && ul_aria_activedescendant_value !== (ul_aria_activedescendant_value = /*editable*/ ctx[10]
    			? undefined
    			: `${/*dropdownId*/ ctx[19]}-item-${/*items*/ ctx[9].indexOf(/*selection*/ ctx[13])}`)) {
    				attr_dev(ul, "aria-activedescendant", ul_aria_activedescendant_value);
    			}

    			if (!current || dirty[0] & /*editable, menuGrowDirection*/ 66560 && ul_class_value !== (ul_class_value = "combo-box-dropdown direction-" + (!/*editable*/ ctx[10]
    			? /*menuGrowDirection*/ ctx[16] ?? 'center'
    			: 'top') + " svelte-1iqhotm")) {
    				attr_dev(ul, "class", ul_class_value);
    			}

    			if (!current || dirty[0] & /*menuOffset*/ 32768) {
    				set_style(ul, "--fds-menu-offset", /*menuOffset*/ ctx[15] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    			/*ul_binding*/ ctx[41](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$a.name,
    		type: "if",
    		source: "(282:2) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (298:5) <ComboBoxItem       role="option"       selected={item.value === value}       disabled={item.disabled}       id="{dropdownId}-item-{i}"       on:keydown={handleKeyboardNavigation}       on:click={() => selectItem(item)}      >
    function create_default_slot$e(ctx) {
    	let t0_value = /*item*/ ctx[52].name + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = space();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*items*/ 512 && t0_value !== (t0_value = /*item*/ ctx[52].name + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$e.name,
    		type: "slot",
    		source: "(298:5) <ComboBoxItem       role=\\\"option\\\"       selected={item.value === value}       disabled={item.disabled}       id=\\\"{dropdownId}-item-{i}\\\"       on:keydown={handleKeyboardNavigation}       on:click={() => selectItem(item)}      >",
    		ctx
    	});

    	return block;
    }

    // (297:4) {#each items as item, i}
    function create_each_block$4(ctx) {
    	let comboboxitem;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[40](/*item*/ ctx[52]);
    	}

    	comboboxitem = new ComboBoxItem({
    			props: {
    				role: "option",
    				selected: /*item*/ ctx[52].value === /*value*/ ctx[0],
    				disabled: /*item*/ ctx[52].disabled,
    				id: "" + (/*dropdownId*/ ctx[19] + "-item-" + /*i*/ ctx[54]),
    				$$slots: { default: [create_default_slot$e] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	comboboxitem.$on("keydown", /*handleKeyboardNavigation*/ ctx[22]);
    	comboboxitem.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			create_component(comboboxitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(comboboxitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const comboboxitem_changes = {};
    			if (dirty[0] & /*items, value*/ 513) comboboxitem_changes.selected = /*item*/ ctx[52].value === /*value*/ ctx[0];
    			if (dirty[0] & /*items*/ 512) comboboxitem_changes.disabled = /*item*/ ctx[52].disabled;

    			if (dirty[0] & /*items*/ 512 | dirty[1] & /*$$scope*/ 65536) {
    				comboboxitem_changes.$$scope = { dirty, ctx };
    			}

    			comboboxitem.$set(comboboxitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(comboboxitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(comboboxitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(comboboxitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(297:4) {#each items as item, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$o(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_2$7, create_else_block$6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editable*/ ctx[10]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = !/*disabled*/ ctx[11] && /*items*/ ctx[9].length > 0 && create_if_block$h(ctx);

    	let div_levels = [
    		{
    			class: div_class_value = "combo-box " + /*className*/ ctx[12]
    		},
    		/*$$restProps*/ ctx[26]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "disabled", /*disabled*/ ctx[11]);
    			toggle_class(div, "editable", /*editable*/ ctx[10]);
    			toggle_class(div, "open", /*open*/ ctx[1]);
    			toggle_class(div, "svelte-1iqhotm", true);
    			add_location(div, file$o, 188, 0, 7768);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding*/ ctx[46](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[17].call(null, div)),
    					action_destroyer(externalMouseEvents.call(null, div, { type: "mousedown" })),
    					listen_dev(div, "outermousedown", /*outermousedown_handler*/ ctx[45], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t);
    			}

    			if (!/*disabled*/ ctx[11] && /*items*/ ctx[9].length > 0) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*disabled, items*/ 2560) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$h(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty[0] & /*className*/ 4096 && div_class_value !== (div_class_value = "combo-box " + /*className*/ ctx[12])) && { class: div_class_value },
    				dirty[0] & /*$$restProps*/ 67108864 && /*$$restProps*/ ctx[26]
    			]));

    			toggle_class(div, "disabled", /*disabled*/ ctx[11]);
    			toggle_class(div, "editable", /*editable*/ ctx[10]);
    			toggle_class(div, "open", /*open*/ ctx[1]);
    			toggle_class(div, "svelte-1iqhotm", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			/*div_binding*/ ctx[46](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$o.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const maxItems = 14; // 504 (`max-block-size` in ComboBox.scss) / 36 (itemHeight)

    function instance$o($$self, $$props, $$invalidate) {
    	let selectableItems;
    	let selection;
    	let menuGrowDirection;

    	const omit_props_names = [
    		"value","searchValue","placeholder","items","editable","disabled","open","class","inputElement","searchInputElement","containerElement","menuElement","buttonElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ComboBox', slots, ['default']);
    	let { value = undefined } = $$props;
    	let { searchValue = undefined } = $$props;
    	let { placeholder = "" } = $$props;
    	let { items = [] } = $$props;
    	let { editable = false } = $$props;
    	let { disabled = false } = $$props;
    	let { open = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { searchInputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	let { menuElement = null } = $$props;
    	let { buttonElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component(), ["open", "close", "select", "change", "input", "beforeinput", "keydown"]);
    	const dispatch = createEventDispatcher();
    	const buttonId = uid("fds-combo-box-button-");
    	const dropdownId = uid("fds-combo-box-dropdown-");
    	let inputFocused = false;
    	let itemHeight = 36;

    	let menuOffset = itemHeight * -(selection
    	? items.indexOf(selection)
    	: Math.floor(items.length > maxItems
    		? maxItems / 2
    		: items.length / 2));

    	onMount(() => {
    		if (!searchValue) $$invalidate(3, searchValue = value);
    	});

    	function updateOffset(target) {
    		const { top: containerTop } = containerElement.getBoundingClientRect();
    		const { top: targetTop } = target.getBoundingClientRect();
    		$$invalidate(15, menuOffset += containerTop - targetTop);
    	}

    	function selectItem(item) {
    		if (item.disabled) return;
    		$$invalidate(0, value = item.value);
    		$$invalidate(3, searchValue = item.name);
    		$$invalidate(1, open = false);
    		if (containerElement && !editable) containerElement.children[0].focus();
    	}

    	async function openMenu() {
    		$$invalidate(1, open = !open);
    		await tick();
    		if (editable && searchInputElement) searchInputElement.focus();
    		if (menuElement && selection) updateOffset(menuElement.children[items.indexOf(selection)]);
    	}

    	async function handleKeyboardNavigation(event) {
    		const { key } = event;
    		event.stopPropagation();
    		const editableClosed = editable && !open;

    		// Conditions for closing the menu.
    		if (key === "Tab" || key === "Esc" || key === "Escape") $$invalidate(1, open = false);

    		// Oh boy, here we go...
    		if (key === "ArrowDown" && !editableClosed && !(items.indexOf(selection) >= items.length - 1)) {
    			$$invalidate(0, value = selectableItems[selectableItems.indexOf(selection) + 1].value); // If down arrow is pressed, check current selection and move to next non-disabled item.
    			$$invalidate(3, searchValue = selectableItems[selectableItems.indexOf(selection) + 1].name);
    		} else if (key === "ArrowUp" && !editableClosed && !(items.indexOf(selection) <= 0)) {
    			$$invalidate(0, value = selectableItems[selectableItems.indexOf(selection) - 1].value); // Do the same with up arrow.
    			$$invalidate(3, searchValue = selectableItems[selectableItems.indexOf(selection) - 1].name);
    		} else if (key === "Home") {
    			$$invalidate(0, value = selectableItems[0].value); // If home is pressed, move to first non-disabled item.
    			$$invalidate(3, searchValue = selectableItems[0].name);
    		} else if (key === "End") {
    			$$invalidate(0, value = selectableItems[selectableItems.length - 1].value); // If end is pressed, move to last non-disabled item.
    			$$invalidate(3, searchValue = selectableItems[selectableItems.length - 1].name);
    		} else if (open && (key === "Enter" || key === " ")) {
    			event.preventDefault();
    			selectItem(selection); // Select item when the enter/space key is pressed and the menu is open
    		} else if (searchInputElement && document.activeElement !== searchInputElement) {
    			searchInputElement.focus(); // If the input element has lost focus, regain it.
    		}

    		// Prevent the browser's default scrolling behavior for these keys
    		if (key === "ArrowDown" || key === "ArrowUp" || key === "Home" || key === "End") event.preventDefault();

    		// Keybindings for opening the menu when in editable mode using arrow keys
    		if (key === "ArrowDown" || key === "ArrowUp" && editable) {
    			if (open) {
    				await tick();

    				searchInputElement === null || searchInputElement === void 0
    				? void 0
    				: searchInputElement.select(); // Select text when an item is chosen.
    			} else {
    				$$invalidate(1, open = true);
    			}
    		}
    	}

    	function handleInputFocus() {
    		searchInputElement.select();
    		$$invalidate(14, inputFocused = true);
    	}

    	function handleInputBlur() {
    		$$invalidate(14, inputFocused = false);
    	}

    	function handleInput(event) {
    		const match = selectableItems.find(i => i.name.toLowerCase().startsWith(searchValue.toLowerCase()));
    		if (!match) $$invalidate(0, value = null);

    		if (match && event.inputType === "insertText" && searchValue.trim() !== "") {
    			$$invalidate(5, searchInputElement.value = match.name, searchInputElement);
    			searchInputElement.setSelectionRange(searchValue.length, match.name.length);
    		}

    		if (match && !match.disabled) $$invalidate(0, value = match.value);
    		$$invalidate(3, searchValue = searchInputElement.value);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function textboxbutton_element_binding(value) {
    		buttonElement = value;
    		$$invalidate(7, buttonElement);
    	}

    	function textbox_value_binding(value) {
    		searchValue = value;
    		$$invalidate(3, searchValue);
    	}

    	function textbox_inputElement_binding(value) {
    		searchInputElement = value;
    		$$invalidate(5, searchInputElement);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function button_element_binding(value) {
    		buttonElement = value;
    		$$invalidate(7, buttonElement);
    	}

    	function keydown_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	const click_handler = item => selectItem(item);

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menuElement = $$value;
    			$$invalidate(2, menuElement);
    		});
    	}

    	const blur_handler = () => $$invalidate(1, open = false);

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(4, inputElement);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const outermousedown_handler = () => {
    		if (open) $$invalidate(1, open = false);
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(6, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(26, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('searchValue' in $$new_props) $$invalidate(3, searchValue = $$new_props.searchValue);
    		if ('placeholder' in $$new_props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ('items' in $$new_props) $$invalidate(9, items = $$new_props.items);
    		if ('editable' in $$new_props) $$invalidate(10, editable = $$new_props.editable);
    		if ('disabled' in $$new_props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('open' in $$new_props) $$invalidate(1, open = $$new_props.open);
    		if ('class' in $$new_props) $$invalidate(12, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(4, inputElement = $$new_props.inputElement);
    		if ('searchInputElement' in $$new_props) $$invalidate(5, searchInputElement = $$new_props.searchInputElement);
    		if ('containerElement' in $$new_props) $$invalidate(6, containerElement = $$new_props.containerElement);
    		if ('menuElement' in $$new_props) $$invalidate(2, menuElement = $$new_props.menuElement);
    		if ('buttonElement' in $$new_props) $$invalidate(7, buttonElement = $$new_props.buttonElement);
    		if ('$$scope' in $$new_props) $$invalidate(47, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		tick,
    		get_current_component,
    		onMount,
    		createEventForwarder,
    		externalMouseEvents,
    		uid,
    		ComboBoxItem,
    		Button,
    		TextBox,
    		TextBoxButton,
    		value,
    		searchValue,
    		placeholder,
    		items,
    		editable,
    		disabled,
    		open,
    		className,
    		inputElement,
    		searchInputElement,
    		containerElement,
    		menuElement,
    		buttonElement,
    		forwardEvents,
    		dispatch,
    		buttonId,
    		dropdownId,
    		inputFocused,
    		itemHeight,
    		maxItems,
    		menuOffset,
    		updateOffset,
    		selectItem,
    		openMenu,
    		handleKeyboardNavigation,
    		handleInputFocus,
    		handleInputBlur,
    		handleInput,
    		selectableItems,
    		selection,
    		menuGrowDirection
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('searchValue' in $$props) $$invalidate(3, searchValue = $$new_props.searchValue);
    		if ('placeholder' in $$props) $$invalidate(8, placeholder = $$new_props.placeholder);
    		if ('items' in $$props) $$invalidate(9, items = $$new_props.items);
    		if ('editable' in $$props) $$invalidate(10, editable = $$new_props.editable);
    		if ('disabled' in $$props) $$invalidate(11, disabled = $$new_props.disabled);
    		if ('open' in $$props) $$invalidate(1, open = $$new_props.open);
    		if ('className' in $$props) $$invalidate(12, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(4, inputElement = $$new_props.inputElement);
    		if ('searchInputElement' in $$props) $$invalidate(5, searchInputElement = $$new_props.searchInputElement);
    		if ('containerElement' in $$props) $$invalidate(6, containerElement = $$new_props.containerElement);
    		if ('menuElement' in $$props) $$invalidate(2, menuElement = $$new_props.menuElement);
    		if ('buttonElement' in $$props) $$invalidate(7, buttonElement = $$new_props.buttonElement);
    		if ('inputFocused' in $$props) $$invalidate(14, inputFocused = $$new_props.inputFocused);
    		if ('itemHeight' in $$props) itemHeight = $$new_props.itemHeight;
    		if ('menuOffset' in $$props) $$invalidate(15, menuOffset = $$new_props.menuOffset);
    		if ('selectableItems' in $$props) selectableItems = $$new_props.selectableItems;
    		if ('selection' in $$props) $$invalidate(13, selection = $$new_props.selection);
    		if ('menuGrowDirection' in $$props) $$invalidate(16, menuGrowDirection = $$new_props.menuGrowDirection);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items*/ 512) {
    			selectableItems = items.filter(item => !item.disabled);
    		}

    		if ($$self.$$.dirty[0] & /*items, value*/ 513) {
    			$$invalidate(13, selection = items.find(i => i.value === value));
    		}

    		if ($$self.$$.dirty[0] & /*menuElement, editable, selection, items*/ 9732) {
    			if (menuElement && menuElement.children.length > 0 && !editable) {
    				if (selection) {
    					menuElement.children[items.indexOf(selection)].focus();
    				} else {
    					menuElement.children[0].focus();
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*items, open*/ 514) {
    			if (items.length > 0) {
    				if (open) {
    					dispatch("open");
    				} else {
    					dispatch("close");
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*selection*/ 8192) {
    			dispatch("select", selection);
    		}

    		if ($$self.$$.dirty[0] & /*selection, items*/ 8704) {
    			$$invalidate(16, menuGrowDirection = !selection || items[items.indexOf(selection)] === items[Math.floor(items.length / 2)]
    			? "center"
    			: items.indexOf(selection) < items.indexOf(items[Math.floor(items.length / 2)])
    				? "top"
    				: "bottom");
    		}
    	};

    	return [
    		value,
    		open,
    		menuElement,
    		searchValue,
    		inputElement,
    		searchInputElement,
    		containerElement,
    		buttonElement,
    		placeholder,
    		items,
    		editable,
    		disabled,
    		className,
    		selection,
    		inputFocused,
    		menuOffset,
    		menuGrowDirection,
    		forwardEvents,
    		buttonId,
    		dropdownId,
    		selectItem,
    		openMenu,
    		handleKeyboardNavigation,
    		handleInputFocus,
    		handleInputBlur,
    		handleInput,
    		$$restProps,
    		slots,
    		change_handler_1,
    		input_handler_1,
    		beforeinput_handler_1,
    		textboxbutton_element_binding,
    		textbox_value_binding,
    		textbox_inputElement_binding,
    		change_handler,
    		input_handler,
    		beforeinput_handler,
    		keydown_handler,
    		button_element_binding,
    		keydown_handler_1,
    		click_handler,
    		ul_binding,
    		blur_handler,
    		input_binding,
    		input_input_handler,
    		outermousedown_handler,
    		div_binding,
    		$$scope
    	];
    }

    class ComboBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$o,
    			create_fragment$o,
    			safe_not_equal,
    			{
    				value: 0,
    				searchValue: 3,
    				placeholder: 8,
    				items: 9,
    				editable: 10,
    				disabled: 11,
    				open: 1,
    				class: 12,
    				inputElement: 4,
    				searchInputElement: 5,
    				containerElement: 6,
    				menuElement: 2,
    				buttonElement: 7
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ComboBox",
    			options,
    			id: create_fragment$o.name
    		});
    	}

    	get value() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchValue() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchValue(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editable() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editable(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchInputElement() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchInputElement(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuElement() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuElement(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonElement() {
    		throw new Error("<ComboBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonElement(value) {
    		throw new Error("<ComboBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/InfoBadge/InfoBadge.svelte generated by Svelte v3.59.2 */
    const file$n = "node_modules/fluent-svelte/InfoBadge/InfoBadge.svelte";

    // (62:39) 
    function create_if_block_4$2(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*svgProps*/ ctx[4], { viewBox: "406 64 213 875" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M405.5,170.5C405.5,156.167 408.333,142.5 414,129.5C419.667,116.5 427.333,105.167 437,95.5C446.667,85.8334 457.917,78.1667 470.75,72.5C483.583,66.8334 497.333,64.0001 512,64C526.333,64.0001 540,66.8334 553,72.5C566,78.1667 577.333,85.8334 587,95.5C596.667,105.167 604.333,116.5 610,129.5C615.667,142.5 618.5,156.167 618.5,170.5C618.5,185.167 615.667,199 610,212C604.333,225 596.667,236.333 587,246C577.333,255.667 566.083,263.333 553.25,269C540.417,274.667 526.667,277.5 512,277.5C497.333,277.5 483.583,274.667 470.75,269C457.917,263.333 446.667,255.667 437,246C427.333,236.333 419.667,225 414,212C408.333,199 405.5,185.167 405.5,170.5ZM426.5,853.5L426.5,512C426.5,500.333 428.75,489.333 433.25,479C437.75,468.667 443.917,459.583 451.75,451.75C459.583,443.917 468.667,437.75 479,433.25C489.333,428.75 500.333,426.5 512,426.5C523.667,426.5 534.667,428.75 545,433.25C555.333,437.75 564.417,443.917 572.25,451.75C580.083,459.583 586.25,468.667 590.75,479C595.25,489.333 597.5,500.333 597.5,512L597.5,853.5C597.5,865.167 595.25,876.167 590.75,886.5C586.25,896.833 580.083,905.833 572.25,913.5C564.417,921.167 555.333,927.25 545,931.75C534.667,936.25 523.667,938.5 512,938.5C500.333,938.5 489.333,936.25 479,931.75C468.667,927.25 459.583,921.167 451.75,913.5C443.917,905.833 437.75,896.833 433.25,886.5C428.75,876.167 426.5,865.167 426.5,853.5Z");
    			add_location(path, file$n, 63, 4, 6710);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-106nxdf", true);
    			add_location(svg, file$n, 62, 3, 6661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			toggle_class(svg, "svelte-106nxdf", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(62:39) ",
    		ctx
    	});

    	return block;
    }

    // (55:36) 
    function create_if_block_3$3(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*svgProps*/ ctx[4], { viewBox: "172 171 683 683" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M512.5,587.5L262.5,838C252.167,848.333 239.5,853.5 224.5,853.5C209.5,853.5 196.917,848.417 186.75,838.25C176.583,828.083 171.5,815.5 171.5,800.5C171.5,785.5 176.667,772.833 187,762.5L437,512L187,262C176.667,251.667 171.5,239.167 171.5,224.5C171.5,217.167 172.833,210.167 175.5,203.5C178.167,196.833 181.917,191.167 186.75,186.5C191.583,181.833 197.167,178.083 203.5,175.25C209.833,172.417 216.833,171 224.5,171C239.167,171 251.667,176.167 262,186.5L512.5,437L762.5,186.5C773.167,175.833 785.833,170.5 800.5,170.5C807.833,170.5 814.75,171.917 821.25,174.75C827.75,177.583 833.417,181.417 838.25,186.25C843.083,191.083 846.833,196.75 849.5,203.25C852.167,209.75 853.5,216.667 853.5,224C853.5,238.667 848.333,251.167 838,261.5L587.5,512L838,762.5C848.667,773.167 854,785.833 854,800.5C854,807.833 852.583,814.667 849.75,821C846.917,827.333 843.083,832.917 838.25,837.75C833.417,842.583 827.75,846.417 821.25,849.25C814.75,852.083 807.833,853.5 800.5,853.5C785.5,853.5 772.833,848.333 762.5,838Z");
    			add_location(path, file$n, 56, 4, 5569);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-106nxdf", true);
    			add_location(svg, file$n, 55, 3, 5519);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			toggle_class(svg, "svelte-106nxdf", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(55:36) ",
    		ctx
    	});

    	return block;
    }

    // (48:35) 
    function create_if_block_2$6(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*svgProps*/ ctx[4], { viewBox: "406 86 213 875" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M426.5,512L426.5,170.5C426.5,158.833 428.75,147.833 433.25,137.5C437.75,127.167 443.917,118.167 451.75,110.5C459.583,102.833 468.667,96.75 479,92.25C489.333,87.75 500.333,85.5 512,85.5C523.667,85.5 534.667,87.75 545,92.25C555.333,96.75 564.417,102.833 572.25,110.5C580.083,118.167 586.25,127.167 590.75,137.5C595.25,147.833 597.5,158.833 597.5,170.5L597.5,512C597.5,523.667 595.25,534.667 590.75,545C586.25,555.333 580.083,564.417 572.25,572.25C564.417,580.083 555.333,586.25 545,590.75C534.667,595.25 523.667,597.5 512,597.5C500.333,597.5 489.333,595.25 479,590.75C468.667,586.25 459.583,580.083 451.75,572.25C443.917,564.417 437.75,555.333 433.25,545C428.75,534.667 426.5,523.667 426.5,512ZM405.5,853.5C405.5,838.833 408.333,825 414,812C419.667,799 427.333,787.667 437,778C446.667,768.333 457.917,760.667 470.75,755C483.583,749.333 497.333,746.5 512,746.5C526.667,746.5 540.417,749.333 553.25,755C566.083,760.667 577.333,768.333 587,778C596.667,787.667 604.333,799 610,812C615.667,825 618.5,838.833 618.5,853.5C618.5,868.167 615.667,881.917 610,894.75C604.333,907.583 596.667,918.833 587,928.5C577.333,938.167 566,945.833 553,951.5C540,957.167 526.333,960 512,960C497.333,960 483.583,957.167 470.75,951.5C457.917,945.833 446.667,938.167 437,928.5C427.333,918.833 419.667,907.583 414,894.75C408.333,881.917 405.5,868.167 405.5,853.5Z");
    			add_location(path, file$n, 49, 4, 4087);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-106nxdf", true);
    			add_location(svg, file$n, 48, 3, 4038);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			toggle_class(svg, "svelte-106nxdf", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$6.name,
    		type: "if",
    		source: "(48:35) ",
    		ctx
    	});

    	return block;
    }

    // (41:35) 
    function create_if_block_1$9(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*svgProps*/ ctx[4], { viewBox: "118 245 790 577" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M117.5,554.5C117.5,547.167 118.917,540.25 121.75,533.75C124.583,527.25 128.417,521.583 133.25,516.75C138.083,511.917 143.75,508.083 150.25,505.25C156.75,502.417 163.667,501 171,501C185.333,501 197.833,506.333 208.5,517L384,692.5L815.5,261C826.167,250.333 838.833,245 853.5,245C860.833,245 867.75,246.417 874.25,249.25C880.75,252.083 886.417,256 891.25,261C896.083,266 899.917,271.75 902.75,278.25C905.583,284.75 907,291.5 907,298.5C907,313.167 901.667,325.833 891,336.5L421.5,805.5C416.5,810.5 410.75,814.417 404.25,817.25C397.75,820.083 391,821.5 384,821.5C369.667,821.5 357.167,816.167 346.5,805.5L133,592.5C122.667,582.167 117.5,569.5 117.5,554.5Z");
    			add_location(path, file$n, 42, 4, 3291);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-106nxdf", true);
    			add_location(svg, file$n, 41, 3, 3241);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			toggle_class(svg, "svelte-106nxdf", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$9.name,
    		type: "if",
    		source: "(41:35) ",
    		ctx
    	});

    	return block;
    }

    // (34:2) {#if severity === "attention"}
    function create_if_block$g(ctx) {
    	let svg;
    	let path;
    	let svg_levels = [/*svgProps*/ ctx[4], { viewBox: "162 118 701 789" }];
    	let svg_data = {};

    	for (let i = 0; i < svg_levels.length; i += 1) {
    		svg_data = assign(svg_data, svg_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M862.5,680C862.5,687.333 861.083,694.25 858.25,700.75C855.417,707.25 851.583,712.917 846.75,717.75C841.917,722.583 836.25,726.417 829.75,729.25C823.25,732.083 816.333,733.5 809,733.5C800,733.5 791.333,731.167 783,726.5L565.5,603.5L565.5,853.5C565.5,860.833 564.083,867.75 561.25,874.25C558.417,880.75 554.583,886.333 549.75,891C544.917,895.667 539.25,899.417 532.75,902.25C526.25,905.083 519.333,906.5 512,906.5C504.667,906.5 497.75,905.083 491.25,902.25C484.75,899.417 479.083,895.667 474.25,891C469.417,886.333 465.583,880.75 462.75,874.25C459.917,867.75 458.5,860.833 458.5,853.5L458.5,603.5L241,726.5C232.667,731.167 224,733.5 215,733.5C207.667,733.5 200.75,732.083 194.25,729.25C187.75,726.417 182.083,722.583 177.25,717.75C172.417,712.917 168.583,707.25 165.75,700.75C162.917,694.25 161.5,687.333 161.5,680C161.5,670.667 164,661.75 169,653.25C174,644.75 180.5,638.167 188.5,633.5L403.5,512L188.5,390.5C180.5,385.833 174,379.25 169,370.75C164,362.25 161.5,353.333 161.5,344C161.5,336.667 162.917,329.75 165.75,323.25C168.583,316.75 172.417,311.083 177.25,306.25C182.083,301.417 187.75,297.583 194.25,294.75C200.75,291.917 207.667,290.5 215,290.5C224.667,290.5 233.333,292.833 241,297.5L458.5,420.5L458.5,170.5C458.5,163.167 459.917,156.25 462.75,149.75C465.583,143.25 469.417,137.667 474.25,133C479.083,128.333 484.75,124.583 491.25,121.75C497.75,118.917 504.667,117.5 512,117.5C519.333,117.5 526.25,118.917 532.75,121.75C539.25,124.583 544.917,128.333 549.75,133C554.583,137.667 558.417,143.25 561.25,149.75C564.083,156.25 565.5,163.167 565.5,170.5L565.5,420.5L783,297.5C791.333,292.833 800,290.5 809,290.5C816.333,290.5 823.25,291.917 829.75,294.75C836.25,297.583 841.917,301.417 846.75,306.25C851.583,311.083 855.417,316.75 858.25,323.25C861.083,329.75 862.5,336.667 862.5,344C862.5,353.333 860,362.25 855,370.75C850,379.25 843.5,385.833 835.5,390.5L620.5,512L835.5,633.5C843.5,638.167 850,644.75 855,653.25C860,661.75 862.5,670.667 862.5,680Z");
    			add_location(path, file$n, 35, 4, 1193);
    			set_svg_attributes(svg, svg_data);
    			toggle_class(svg, "svelte-106nxdf", true);
    			add_location(svg, file$n, 34, 3, 1143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			toggle_class(svg, "svelte-106nxdf", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$g.name,
    		type: "if",
    		source: "(34:2) {#if severity === \\\"attention\\\"}",
    		ctx
    	});

    	return block;
    }

    // (33:7)    
    function fallback_block$5(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*severity*/ ctx[1] === "attention") return create_if_block$g;
    		if (/*severity*/ ctx[1] === "success") return create_if_block_1$9;
    		if (/*severity*/ ctx[1] === "caution") return create_if_block_2$6;
    		if (/*severity*/ ctx[1] === "critical") return create_if_block_3$3;
    		if (/*severity*/ ctx[1] === "information") return create_if_block_4$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$5.name,
    		type: "fallback",
    		source: "(33:7)    ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$n(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);
    	const default_slot_or_fallback = default_slot || fallback_block$5(ctx);

    	let span_levels = [
    		{
    			class: span_class_value = "info-badge severity-" + /*severity*/ ctx[1] + " " + /*className*/ ctx[2]
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(span, span_data);
    			toggle_class(span, "svelte-106nxdf", true);
    			add_location(span, file$n, 26, 0, 981);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(span, null);
    			}

    			/*span_binding*/ ctx[8](span);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[3].call(null, span));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*severity*/ 2)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				(!current || dirty & /*severity, className*/ 6 && span_class_value !== (span_class_value = "info-badge severity-" + /*severity*/ ctx[1] + " " + /*className*/ ctx[2])) && { class: span_class_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(span, "svelte-106nxdf", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*span_binding*/ ctx[8](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	const omit_props_names = ["severity","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoBadge', slots, ['default']);
    	let { severity = "attention" } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	const svgProps = {
    		"aria-hidden": true,
    		xmlns: "http://www.w3.org/2000/svg"
    	};

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('severity' in $$new_props) $$invalidate(1, severity = $$new_props.severity);
    		if ('class' in $$new_props) $$invalidate(2, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		get_current_component,
    		severity,
    		className,
    		element,
    		forwardEvents,
    		svgProps
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('severity' in $$props) $$invalidate(1, severity = $$new_props.severity);
    		if ('className' in $$props) $$invalidate(2, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		severity,
    		className,
    		forwardEvents,
    		svgProps,
    		$$restProps,
    		$$scope,
    		slots,
    		span_binding
    	];
    }

    class InfoBadge extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { severity: 1, class: 2, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoBadge",
    			options,
    			id: create_fragment$n.name
    		});
    	}

    	get severity() {
    		throw new Error("<InfoBadge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set severity(value) {
    		throw new Error("<InfoBadge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<InfoBadge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<InfoBadge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<InfoBadge>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<InfoBadge>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function circOut(t) {
        return Math.sqrt(1 - --t * t);
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        const [xValue, xUnit] = split_css_unit(x);
        const [yValue, yUnit] = split_css_unit(y);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * xValue}${xUnit}, ${(1 - t) * yValue}${yUnit});
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* node_modules/fluent-svelte/Flyout/FlyoutWrapper.svelte generated by Svelte v3.59.2 */
    const file$m = "node_modules/fluent-svelte/Flyout/FlyoutWrapper.svelte";
    const get_flyout_slot_changes$4 = dirty => ({});
    const get_flyout_slot_context$4 = ctx => ({});
    const get_override_slot_changes = dirty => ({});
    const get_override_slot_context = ctx => ({});

    // (80:1) {#if open}
    function create_if_block$f(ctx) {
    	let div0;
    	let div0_class_value;
    	let div0_style_value;
    	let div0_outro;
    	let t;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	const override_slot_template = /*#slots*/ ctx[17].override;
    	const override_slot = create_slot(override_slot_template, ctx, /*$$scope*/ ctx[23], get_override_slot_context);
    	const override_slot_or_fallback = override_slot || fallback_block$4(ctx);

    	let div0_levels = [
    		{ id: /*menuId*/ ctx[10] },
    		{
    			class: div0_class_value = "flyout-anchor placement-" + /*placement*/ ctx[5] + " alignment-" + /*alignment*/ ctx[6]
    		},
    		{
    			style: div0_style_value = "--fds-flyout-offset: " + /*offset*/ ctx[7] + "px;"
    		},
    		/*$$restProps*/ ctx[14]
    	];

    	let div_data_1 = {};

    	for (let i = 0; i < div0_levels.length; i += 1) {
    		div_data_1 = assign(div_data_1, div0_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			if (override_slot_or_fallback) override_slot_or_fallback.c();
    			t = space();
    			div1 = element("div");
    			set_attributes(div0, div_data_1);
    			toggle_class(div0, "svelte-14i765b", true);
    			add_location(div0, file$m, 80, 2, 2725);
    			attr_dev(div1, "class", "flyout-backdrop svelte-14i765b");
    			add_location(div1, file$m, 99, 2, 3222);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);

    			if (override_slot_or_fallback) {
    				override_slot_or_fallback.m(div0, null);
    			}

    			/*div0_binding*/ ctx[19](div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			/*div1_binding*/ ctx[20](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*_focusTrap*/ ctx[9].call(null, div0)),
    					listen_dev(div0, "click", click_handler$1, false, false, false, false),
    					listen_dev(div1, "click", click_handler_1$1, false, false, false, false),
    					listen_dev(div1, "mousedown", /*closeFlyout*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (override_slot) {
    				if (override_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						override_slot,
    						override_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(override_slot_template, /*$$scope*/ ctx[23], dirty, get_override_slot_changes),
    						get_override_slot_context
    					);
    				}
    			} else {
    				if (override_slot_or_fallback && override_slot_or_fallback.p && (!current || dirty & /*menuElement, $$scope*/ 8388616)) {
    					override_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div0, div_data_1 = get_spread_update(div0_levels, [
    				{ id: /*menuId*/ ctx[10] },
    				(!current || dirty & /*placement, alignment*/ 96 && div0_class_value !== (div0_class_value = "flyout-anchor placement-" + /*placement*/ ctx[5] + " alignment-" + /*alignment*/ ctx[6])) && { class: div0_class_value },
    				(!current || dirty & /*offset*/ 128 && div0_style_value !== (div0_style_value = "--fds-flyout-offset: " + /*offset*/ ctx[7] + "px;")) && { style: div0_style_value },
    				dirty & /*$$restProps*/ 16384 && /*$$restProps*/ ctx[14]
    			]));

    			toggle_class(div0, "svelte-14i765b", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(override_slot_or_fallback, local);
    			if (div0_outro) div0_outro.end(1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(override_slot_or_fallback, local);

    			if (local) {
    				div0_outro = create_out_transition(div0, fade, {
    					duration: getCSSDuration("--fds-control-faster-duration"),
    					easing: circOut
    				});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (override_slot_or_fallback) override_slot_or_fallback.d(detaching);
    			/*div0_binding*/ ctx[19](null);
    			if (detaching && div0_outro) div0_outro.end();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[20](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$f.name,
    		type: "if",
    		source: "(80:1) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (95:4) <FlyoutSurface bind:element={menuElement}>
    function create_default_slot$d(ctx) {
    	let current;
    	const flyout_slot_template = /*#slots*/ ctx[17].flyout;
    	const flyout_slot = create_slot(flyout_slot_template, ctx, /*$$scope*/ ctx[23], get_flyout_slot_context$4);

    	const block = {
    		c: function create() {
    			if (flyout_slot) flyout_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (flyout_slot) {
    				flyout_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (flyout_slot) {
    				if (flyout_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						flyout_slot,
    						flyout_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(flyout_slot_template, /*$$scope*/ ctx[23], dirty, get_flyout_slot_changes$4),
    						get_flyout_slot_context$4
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (flyout_slot) flyout_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$d.name,
    		type: "slot",
    		source: "(95:4) <FlyoutSurface bind:element={menuElement}>",
    		ctx
    	});

    	return block;
    }

    // (94:25)      
    function fallback_block$4(ctx) {
    	let flyoutsurface;
    	let updating_element;
    	let current;

    	function flyoutsurface_element_binding(value) {
    		/*flyoutsurface_element_binding*/ ctx[18](value);
    	}

    	let flyoutsurface_props = {
    		$$slots: { default: [create_default_slot$d] },
    		$$scope: { ctx }
    	};

    	if (/*menuElement*/ ctx[3] !== void 0) {
    		flyoutsurface_props.element = /*menuElement*/ ctx[3];
    	}

    	flyoutsurface = new FlyoutSurface({
    			props: flyoutsurface_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(flyoutsurface, 'element', flyoutsurface_element_binding));

    	const block = {
    		c: function create() {
    			create_component(flyoutsurface.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flyoutsurface, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flyoutsurface_changes = {};

    			if (dirty & /*$$scope*/ 8388608) {
    				flyoutsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*menuElement*/ 8) {
    				updating_element = true;
    				flyoutsurface_changes.element = /*menuElement*/ ctx[3];
    				add_flush_callback(() => updating_element = false);
    			}

    			flyoutsurface.$set(flyoutsurface_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyoutsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyoutsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flyoutsurface, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$4.name,
    		type: "fallback",
    		source: "(94:25)      ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$m(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);
    	let if_block = /*open*/ ctx[0] && create_if_block$f(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "flyout-wrapper " + /*className*/ ctx[8] + " svelte-14i765b");
    			attr_dev(div, "aria-expanded", /*open*/ ctx[0]);
    			attr_dev(div, "aria-haspopup", /*open*/ ctx[0]);
    			attr_dev(div, "aria-controls", /*menuId*/ ctx[10]);
    			add_location(div, file$m, 69, 0, 2501);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleEscapeKey*/ ctx[11], false, false, false, false),
    					listen_dev(div, "click", /*click_handler_2*/ ctx[21], false, false, false, false),
    					listen_dev(div, "keydown", /*handleKeyDown*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$f(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*className*/ 256 && div_class_value !== (div_class_value = "flyout-wrapper " + /*className*/ ctx[8] + " svelte-14i765b")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(div, "aria-expanded", /*open*/ ctx[0]);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(div, "aria-haspopup", /*open*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler$1 = e => e.stopPropagation();
    const click_handler_1$1 = e => e.stopPropagation();

    function instance$m($$self, $$props, $$invalidate) {
    	let _focusTrap;

    	const omit_props_names = [
    		"open","closable","placement","alignment","offset","trapFocus","class","wrapperElement","anchorElement","menuElement","backdropElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('FlyoutWrapper', slots, ['default','flyout','override']);
    	let { open = false } = $$props;
    	let { closable = true } = $$props;
    	let { placement = "top" } = $$props;
    	let { alignment = "center" } = $$props;
    	let { offset = 4 } = $$props;
    	let { trapFocus = true } = $$props;
    	let { class: className = "" } = $$props;
    	let { wrapperElement = null } = $$props;
    	let { anchorElement = null } = $$props;
    	let { menuElement = null } = $$props;
    	let { backdropElement = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const menuId = uid("fds-flyout-anchor-");

    	function handleEscapeKey({ key }) {
    		if (key === "Escape" && closable) $$invalidate(0, open = false);
    	}

    	function closeFlyout() {
    		if (closable) $$invalidate(0, open = false);
    	}

    	function handleKeyDown(event) {
    		if (event.key === " " || event.key === "Enter") {
    			event.preventDefault();
    			$$invalidate(0, open = !open);
    		}
    	}

    	function flyoutsurface_element_binding(value) {
    		menuElement = value;
    		$$invalidate(3, menuElement);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			anchorElement = $$value;
    			$$invalidate(2, anchorElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			backdropElement = $$value;
    			$$invalidate(4, backdropElement);
    		});
    	}

    	const click_handler_2 = () => $$invalidate(0, open = !open);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapperElement = $$value;
    			$$invalidate(1, wrapperElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(14, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$new_props) $$invalidate(15, closable = $$new_props.closable);
    		if ('placement' in $$new_props) $$invalidate(5, placement = $$new_props.placement);
    		if ('alignment' in $$new_props) $$invalidate(6, alignment = $$new_props.alignment);
    		if ('offset' in $$new_props) $$invalidate(7, offset = $$new_props.offset);
    		if ('trapFocus' in $$new_props) $$invalidate(16, trapFocus = $$new_props.trapFocus);
    		if ('class' in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ('wrapperElement' in $$new_props) $$invalidate(1, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$new_props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$new_props) $$invalidate(3, menuElement = $$new_props.menuElement);
    		if ('backdropElement' in $$new_props) $$invalidate(4, backdropElement = $$new_props.backdropElement);
    		if ('$$scope' in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		uid,
    		focusTrap,
    		getCSSDuration,
    		fade,
    		circOut,
    		FlyoutSurface,
    		open,
    		closable,
    		placement,
    		alignment,
    		offset,
    		trapFocus,
    		className,
    		wrapperElement,
    		anchorElement,
    		menuElement,
    		backdropElement,
    		dispatch,
    		menuId,
    		handleEscapeKey,
    		closeFlyout,
    		handleKeyDown,
    		_focusTrap
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$props) $$invalidate(15, closable = $$new_props.closable);
    		if ('placement' in $$props) $$invalidate(5, placement = $$new_props.placement);
    		if ('alignment' in $$props) $$invalidate(6, alignment = $$new_props.alignment);
    		if ('offset' in $$props) $$invalidate(7, offset = $$new_props.offset);
    		if ('trapFocus' in $$props) $$invalidate(16, trapFocus = $$new_props.trapFocus);
    		if ('className' in $$props) $$invalidate(8, className = $$new_props.className);
    		if ('wrapperElement' in $$props) $$invalidate(1, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$props) $$invalidate(3, menuElement = $$new_props.menuElement);
    		if ('backdropElement' in $$props) $$invalidate(4, backdropElement = $$new_props.backdropElement);
    		if ('_focusTrap' in $$props) $$invalidate(9, _focusTrap = $$new_props._focusTrap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*trapFocus*/ 65536) {
    			$$invalidate(9, _focusTrap = trapFocus
    			? focusTrap
    			: () => {
    					
    				});
    		}

    		if ($$self.$$.dirty & /*open*/ 1) {
    			if (open) {
    				dispatch("open");
    			} else {
    				dispatch("close");
    			}
    		}
    	};

    	return [
    		open,
    		wrapperElement,
    		anchorElement,
    		menuElement,
    		backdropElement,
    		placement,
    		alignment,
    		offset,
    		className,
    		_focusTrap,
    		menuId,
    		handleEscapeKey,
    		closeFlyout,
    		handleKeyDown,
    		$$restProps,
    		closable,
    		trapFocus,
    		slots,
    		flyoutsurface_element_binding,
    		div0_binding,
    		div1_binding,
    		click_handler_2,
    		div_binding,
    		$$scope
    	];
    }

    class FlyoutWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			open: 0,
    			closable: 15,
    			placement: 5,
    			alignment: 6,
    			offset: 7,
    			trapFocus: 16,
    			class: 8,
    			wrapperElement: 1,
    			anchorElement: 2,
    			menuElement: 3,
    			backdropElement: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlyoutWrapper",
    			options,
    			id: create_fragment$m.name
    		});
    	}

    	get open() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trapFocus() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trapFocus(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapperElement() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapperElement(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorElement() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorElement(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuElement() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuElement(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropElement() {
    		throw new Error("<FlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropElement(value) {
    		throw new Error("<FlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/InfoBar/InfoBar.svelte generated by Svelte v3.59.2 */
    const file$l = "node_modules/fluent-svelte/InfoBar/InfoBar.svelte";
    const get_action_slot_changes = dirty => ({});
    const get_action_slot_context = ctx => ({});
    const get_icon_slot_changes$3 = dirty => ({});
    const get_icon_slot_context$3 = ctx => ({});

    // (52:0) {#if open}
    function create_if_block$e(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let t3;
    	let div2_class_value;
    	let div2_resize_listener;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[19].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[18], get_icon_slot_context$3);
    	const icon_slot_or_fallback = icon_slot || fallback_block$3(ctx);
    	let if_block0 = /*title*/ ctx[8] && create_if_block_4$1(ctx);
    	let if_block1 = (/*message*/ ctx[9] || /*$$slots*/ ctx[17].default) && create_if_block_3$2(ctx);
    	let if_block2 = /*$$slots*/ ctx[17].action && create_if_block_2$5(ctx);
    	let if_block3 = /*closable*/ ctx[6] && create_if_block_1$8(ctx);

    	let div2_levels = [
    		{
    			class: div2_class_value = "info-bar severity-" + /*severity*/ ctx[7] + " " + /*className*/ ctx[10]
    		},
    		{ role: "alert" },
    		/*$$restProps*/ ctx[16]
    	];

    	let div_data_2 = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div_data_2 = assign(div_data_2, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div0, "class", "info-bar-icon svelte-fp4fp6");
    			add_location(div0, file$l, 60, 2, 2510);
    			attr_dev(div1, "class", "info-bar-content svelte-fp4fp6");
    			toggle_class(div1, "wrapped", /*wrapped*/ ctx[14]);
    			toggle_class(div1, "action-visible", /*$$slots*/ ctx[17].action);
    			toggle_class(div1, "action-wrapped", /*actionWrapped*/ ctx[13]);
    			toggle_class(div1, "message-wrapped", /*messageWrapped*/ ctx[12]);
    			add_location(div1, file$l, 65, 2, 2611);
    			set_attributes(div2, div_data_2);
    			add_render_callback(() => /*div2_elementresize_handler*/ ctx[26].call(div2));
    			toggle_class(div2, "svelte-fp4fp6", true);
    			add_location(div2, file$l, 52, 1, 2353);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div0, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t2);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div2, t3);
    			if (if_block3) if_block3.m(div2, null);
    			/*div2_binding*/ ctx[25](div2);
    			div2_resize_listener = add_iframe_resize_listener(div2, /*div2_elementresize_handler*/ ctx[26].bind(div2));
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[15].call(null, div2));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[18], dirty, get_icon_slot_changes$3),
    						get_icon_slot_context$3
    					);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && (!current || dirty & /*severity*/ 128)) {
    					icon_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			if (/*title*/ ctx[8]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*message*/ ctx[9] || /*$$slots*/ ctx[17].default) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*message, $$slots*/ 131584) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*$$slots*/ ctx[17].action) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 131072) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$5(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$$slots*/ 131072) {
    				toggle_class(div1, "action-visible", /*$$slots*/ ctx[17].action);
    			}

    			if (!current || dirty & /*actionWrapped*/ 8192) {
    				toggle_class(div1, "action-wrapped", /*actionWrapped*/ ctx[13]);
    			}

    			if (!current || dirty & /*messageWrapped*/ 4096) {
    				toggle_class(div1, "message-wrapped", /*messageWrapped*/ ctx[12]);
    			}

    			if (/*closable*/ ctx[6]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$8(ctx);
    					if_block3.c();
    					if_block3.m(div2, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			set_attributes(div2, div_data_2 = get_spread_update(div2_levels, [
    				(!current || dirty & /*severity, className*/ 1152 && div2_class_value !== (div2_class_value = "info-bar severity-" + /*severity*/ ctx[7] + " " + /*className*/ ctx[10])) && { class: div2_class_value },
    				{ role: "alert" },
    				dirty & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));

    			toggle_class(div2, "svelte-fp4fp6", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			/*div2_binding*/ ctx[25](null);
    			div2_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$e.name,
    		type: "if",
    		source: "(52:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (62:21)      
    function fallback_block$3(ctx) {
    	let infobadge;
    	let current;

    	infobadge = new InfoBadge({
    			props: { severity: /*severity*/ ctx[7] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(infobadge.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(infobadge, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const infobadge_changes = {};
    			if (dirty & /*severity*/ 128) infobadge_changes.severity = /*severity*/ ctx[7];
    			infobadge.$set(infobadge_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infobadge.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infobadge.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(infobadge, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$3.name,
    		type: "fallback",
    		source: "(62:21)      ",
    		ctx
    	});

    	return block;
    }

    // (73:3) {#if title}
    function create_if_block_4$1(ctx) {
    	let h5;
    	let t;

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			t = text(/*title*/ ctx[8]);
    			attr_dev(h5, "class", "svelte-fp4fp6");
    			add_location(h5, file$l, 73, 4, 2807);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);
    			append_dev(h5, t);
    			/*h5_binding*/ ctx[20](h5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 256) set_data_dev(t, /*title*/ ctx[8]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			/*h5_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(73:3) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (78:3) {#if message || $$slots.default}
    function create_if_block_3$2(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[19].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*message*/ ctx[9]);
    			t1 = space();
    			if (default_slot) default_slot.c();
    			attr_dev(p, "class", "svelte-fp4fp6");
    			add_location(p, file$l, 78, 4, 2909);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			/*p_binding*/ ctx[21](p);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*message*/ 512) set_data_dev(t0, /*message*/ ctx[9]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    			/*p_binding*/ ctx[21](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(78:3) {#if message || $$slots.default}",
    		ctx
    	});

    	return block;
    }

    // (84:3) {#if $$slots.action}
    function create_if_block_2$5(ctx) {
    	let div;
    	let current;
    	const action_slot_template = /*#slots*/ ctx[19].action;
    	const action_slot = create_slot(action_slot_template, ctx, /*$$scope*/ ctx[18], get_action_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (action_slot) action_slot.c();
    			attr_dev(div, "class", "info-bar-action svelte-fp4fp6");
    			add_location(div, file$l, 84, 4, 3015);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (action_slot) {
    				action_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[22](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (action_slot) {
    				if (action_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						action_slot,
    						action_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(action_slot_template, /*$$scope*/ ctx[18], dirty, get_action_slot_changes),
    						get_action_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(action_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(action_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (action_slot) action_slot.d(detaching);
    			/*div_binding*/ ctx[22](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$5.name,
    		type: "if",
    		source: "(84:3) {#if $$slots.action}",
    		ctx
    	});

    	return block;
    }

    // (90:2) {#if closable}
    function create_if_block_1$8(ctx) {
    	let button;
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M512,584.5L87.5,1009C77.5,1019 65.5,1024 51.5,1024C36.8333,1024 24.5833,1019.08 14.75,1009.25C4.91667,999.417 0,987.167 0,972.5C0,958.5 5,946.5 15,936.5L439.5,512L15,87.5C5,77.5 0,65.3334 0,51C0,44 1.33333,37.3334 4,31C6.66667,24.6667 10.3333,19.25 15,14.75C19.6667,10.25 25.1667,6.66669 31.5,4C37.8333,1.33337 44.5,0 51.5,0C65.5,0 77.5,5 87.5,15L512,439.5L936.5,15C946.5,5 958.667,0 973,0C980,0 986.583,1.33337 992.75,4C998.917,6.66669 1004.33,10.3334 1009,15C1013.67,19.6667 1017.33,25.0834 1020,31.25C1022.67,37.4167 1024,44 1024,51C1024,65.3334 1019,77.5 1009,87.5L584.5,512L1009,936.5C1019,946.5 1024,958.5 1024,972.5C1024,979.5 1022.67,986.167 1020,992.5C1017.33,998.833 1013.75,1004.33 1009.25,1009C1004.75,1013.67 999.333,1017.33 993,1020C986.667,1022.67 980,1024 973,1024C958.667,1024 946.5,1019 936.5,1009Z");
    			add_location(path, file$l, 104, 5, 3453);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 1024 1024");
    			attr_dev(svg, "class", "svelte-fp4fp6");
    			add_location(svg, file$l, 97, 4, 3311);
    			attr_dev(button, "class", "info-bar-close-button svelte-fp4fp6");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "Close");
    			add_location(button, file$l, 90, 3, 3148);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			/*button_binding*/ ctx[24](button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[23], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			/*button_binding*/ ctx[24](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$8.name,
    		type: "if",
    		source: "(90:2) {#if closable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && create_if_block$e(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$e(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let actionWrapped;
    	let messageWrapped;

    	const omit_props_names = [
    		"open","closable","severity","title","message","class","element","titleElement","messageElement","actionElement","closeButtonElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoBar', slots, ['icon','default','action']);
    	const $$slots = compute_slots(slots);
    	let { open = true } = $$props;
    	let { closable = true } = $$props;
    	let { severity = "information" } = $$props;
    	let { title = "" } = $$props;
    	let { message = "" } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { titleElement = null } = $$props;
    	let { messageElement = null } = $$props;
    	let { actionElement = null } = $$props;
    	let { closeButtonElement = null } = $$props;
    	let wrapped = false;
    	let clientHeight = 0;
    	const dispatch = createEventDispatcher();
    	const forwardEvents = createEventForwarder(get_current_component());

    	function h5_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			titleElement = $$value;
    			$$invalidate(1, titleElement);
    		});
    	}

    	function p_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			messageElement = $$value;
    			$$invalidate(2, messageElement);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			actionElement = $$value;
    			$$invalidate(3, actionElement);
    		});
    	}

    	const click_handler = () => $$invalidate(0, open = false);

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			closeButtonElement = $$value;
    			$$invalidate(5, closeButtonElement);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(4, element);
    		});
    	}

    	function div2_elementresize_handler() {
    		clientHeight = this.clientHeight;
    		$$invalidate(11, clientHeight);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$new_props) $$invalidate(6, closable = $$new_props.closable);
    		if ('severity' in $$new_props) $$invalidate(7, severity = $$new_props.severity);
    		if ('title' in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ('message' in $$new_props) $$invalidate(9, message = $$new_props.message);
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(4, element = $$new_props.element);
    		if ('titleElement' in $$new_props) $$invalidate(1, titleElement = $$new_props.titleElement);
    		if ('messageElement' in $$new_props) $$invalidate(2, messageElement = $$new_props.messageElement);
    		if ('actionElement' in $$new_props) $$invalidate(3, actionElement = $$new_props.actionElement);
    		if ('closeButtonElement' in $$new_props) $$invalidate(5, closeButtonElement = $$new_props.closeButtonElement);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		get_current_component,
    		createEventForwarder,
    		InfoBadge,
    		open,
    		closable,
    		severity,
    		title,
    		message,
    		className,
    		element,
    		titleElement,
    		messageElement,
    		actionElement,
    		closeButtonElement,
    		wrapped,
    		clientHeight,
    		dispatch,
    		forwardEvents,
    		messageWrapped,
    		actionWrapped
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$props) $$invalidate(6, closable = $$new_props.closable);
    		if ('severity' in $$props) $$invalidate(7, severity = $$new_props.severity);
    		if ('title' in $$props) $$invalidate(8, title = $$new_props.title);
    		if ('message' in $$props) $$invalidate(9, message = $$new_props.message);
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(4, element = $$new_props.element);
    		if ('titleElement' in $$props) $$invalidate(1, titleElement = $$new_props.titleElement);
    		if ('messageElement' in $$props) $$invalidate(2, messageElement = $$new_props.messageElement);
    		if ('actionElement' in $$props) $$invalidate(3, actionElement = $$new_props.actionElement);
    		if ('closeButtonElement' in $$props) $$invalidate(5, closeButtonElement = $$new_props.closeButtonElement);
    		if ('wrapped' in $$props) $$invalidate(14, wrapped = $$new_props.wrapped);
    		if ('clientHeight' in $$props) $$invalidate(11, clientHeight = $$new_props.clientHeight);
    		if ('messageWrapped' in $$props) $$invalidate(12, messageWrapped = $$new_props.messageWrapped);
    		if ('actionWrapped' in $$props) $$invalidate(13, actionWrapped = $$new_props.actionWrapped);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*clientHeight, actionElement*/ 2056) {
    			$$invalidate(13, actionWrapped = clientHeight && (actionElement === null || actionElement === void 0
    			? void 0
    			: actionElement.offsetTop) > 0);
    		}

    		if ($$self.$$.dirty & /*clientHeight, messageElement, titleElement*/ 2054) {
    			$$invalidate(12, messageWrapped = clientHeight && (messageElement === null || messageElement === void 0
    			? void 0
    			: messageElement.offsetTop) > (titleElement === null || titleElement === void 0
    			? void 0
    			: titleElement.offsetTop));
    		}

    		if ($$self.$$.dirty & /*open*/ 1) {
    			if (open) {
    				dispatch("open");
    			} else {
    				dispatch("close");
    			}
    		}
    	};

    	return [
    		open,
    		titleElement,
    		messageElement,
    		actionElement,
    		element,
    		closeButtonElement,
    		closable,
    		severity,
    		title,
    		message,
    		className,
    		clientHeight,
    		messageWrapped,
    		actionWrapped,
    		wrapped,
    		forwardEvents,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		h5_binding,
    		p_binding,
    		div_binding,
    		click_handler,
    		button_binding,
    		div2_binding,
    		div2_elementresize_handler
    	];
    }

    class InfoBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$l, create_fragment$l, safe_not_equal, {
    			open: 0,
    			closable: 6,
    			severity: 7,
    			title: 8,
    			message: 9,
    			class: 10,
    			element: 4,
    			titleElement: 1,
    			messageElement: 2,
    			actionElement: 3,
    			closeButtonElement: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoBar",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get open() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get severity() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set severity(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get titleElement() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set titleElement(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get messageElement() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messageElement(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get actionElement() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actionElement(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeButtonElement() {
    		throw new Error("<InfoBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeButtonElement(value) {
    		throw new Error("<InfoBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/NumberBox/NumberBox.svelte generated by Svelte v3.59.2 */
    const file$k = "node_modules/fluent-svelte/NumberBox/NumberBox.svelte";
    const get_buttons_slot_changes$1 = dirty => ({});
    const get_buttons_slot_context$1 = ctx => ({});

    // (80:0) <TextBox  class="number-box {className ?? ''}"  type="number"  bind:inputElement  bind:containerElement  bind:buttonsContainerElement  bind:clearButtonElement  bind:value  on:outermousedown={() => (spinnerFlyoutOpen = false)}  on:change  on:input  on:beforeinput  on:click  on:blur  on:focus={() => (spinnerFlyoutOpen = true)}  on:focus  on:dblclick  on:contextmenu  on:mousedown  on:mouseup  on:mouseover  on:mouseout  on:mouseenter  on:mouseleave  on:keypress  on:keydown  on:keyup  on:clear  {min}  {max}  {step}  {disabled}  {...$$restProps} >
    function create_default_slot_5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[24].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[56], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[56],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[56])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[56], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(80:0) <TextBox  class=\\\"number-box {className ?? ''}\\\"  type=\\\"number\\\"  bind:inputElement  bind:containerElement  bind:buttonsContainerElement  bind:clearButtonElement  bind:value  on:outermousedown={() => (spinnerFlyoutOpen = false)}  on:change  on:input  on:beforeinput  on:click  on:blur  on:focus={() => (spinnerFlyoutOpen = true)}  on:focus  on:dblclick  on:contextmenu  on:mousedown  on:mouseup  on:mouseover  on:mouseout  on:mouseenter  on:mouseleave  on:keypress  on:keydown  on:keyup  on:clear  {min}  {max}  {step}  {disabled}  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    // (165:2) {:else}
    function create_else_block$5(ctx) {
    	let textboxbutton;
    	let t;
    	let if_block_anchor;
    	let current;

    	textboxbutton = new TextBoxButton({
    			props: {
    				disabled: /*disabled*/ ctx[12],
    				class: "number-box-spinner-compact",
    				tabindex: "-1",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	textboxbutton.$on("mousedown", /*mousedown_handler_1*/ ctx[27]);
    	let if_block = /*spinnerFlyoutOpen*/ ctx[14] && create_if_block_2$4(ctx);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton, target, anchor);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton_changes = {};
    			if (dirty[0] & /*disabled*/ 4096) textboxbutton_changes.disabled = /*disabled*/ ctx[12];

    			if (dirty[1] & /*$$scope*/ 33554432) {
    				textboxbutton_changes.$$scope = { dirty, ctx };
    			}

    			textboxbutton.$set(textboxbutton_changes);

    			if (/*spinnerFlyoutOpen*/ ctx[14]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*spinnerFlyoutOpen*/ 16384) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton, detaching);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(165:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (116:2) {#if inline}
    function create_if_block$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*disabled*/ ctx[12] && create_if_block_1$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!/*disabled*/ ctx[12]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*disabled*/ 4096) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$d.name,
    		type: "if",
    		source: "(116:2) {#if inline}",
    		ctx
    	});

    	return block;
    }

    // (166:3) <TextBoxButton     {disabled}     class="number-box-spinner-compact"     tabindex="-1"     on:mousedown={() => inputElement.focus()}    >
    function create_default_slot_4$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M128,384C128,375.333 131.167,367.833 137.5,361.5L487,10.5C494,3.5 502.333,0 512,0C521.667,0 530,3.5 537,10.5L886.5,361.5C892.833,367.833 896,375.333 896,384C896,392.667 892.833,400.167 886.5,406.5C880.167,412.833 872.667,416 864,416C855.333,416 847.833,412.833 841.5,406.5L512,76L182.5,406.5C176.167,412.833 168.667,416 160,416C151.333,416 143.833,412.833 137.5,406.5C131.167,400.167 128,392.667 128,384ZM128,640C128,631.333 131.167,623.833 137.5,617.5C143.833,611.167 151.333,608 160,608C168.667,608 176.167,611.167 182.5,617.5L512,948L841.5,617.5C847.833,611.167 855.333,608 864,608C872.667,608 880.167,611.167 886.5,617.5C892.833,623.833 896,631.333 896,640C896,648.667 892.833,656.167 886.5,662.5L537,1013.5C530,1020.5 521.667,1024 512,1024C502.333,1024 494,1020.5 487,1013.5L137.5,662.5C131.167,656.167 128,648.667 128,640Z");
    			add_location(path, file$k, 178, 5, 6076);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "viewBox", "128 0 768 1024");
    			add_location(svg, file$k, 171, 4, 5931);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(166:3) <TextBoxButton     {disabled}     class=\\\"number-box-spinner-compact\\\"     tabindex=\\\"-1\\\"     on:mousedown={() => inputElement.focus()}    >",
    		ctx
    	});

    	return block;
    }

    // (185:3) {#if spinnerFlyoutOpen}
    function create_if_block_2$4(ctx) {
    	let div;
    	let textboxbutton0;
    	let updating_element;
    	let t;
    	let textboxbutton1;
    	let updating_element_1;
    	let current;

    	function textboxbutton0_element_binding_1(value) {
    		/*textboxbutton0_element_binding_1*/ ctx[28](value);
    	}

    	let textboxbutton0_props = {
    		class: "number-box-spinner",
    		disabled: /*spinUpButtonDisabled*/ ctx[16],
    		"aria-label": "Increase number",
    		tabindex: "-1",
    		$$slots: { default: [create_default_slot_3$1] },
    		$$scope: { ctx }
    	};

    	if (/*spinUpButtonElement*/ ctx[4] !== void 0) {
    		textboxbutton0_props.element = /*spinUpButtonElement*/ ctx[4];
    	}

    	textboxbutton0 = new TextBoxButton({
    			props: textboxbutton0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton0, 'element', textboxbutton0_element_binding_1));
    	textboxbutton0.$on("mousedown", /*spinUp*/ ctx[17]);
    	textboxbutton0.$on("mouseup", /*stopSpinIntervals*/ ctx[19]);
    	textboxbutton0.$on("mouseleave", /*stopSpinIntervals*/ ctx[19]);

    	function textboxbutton1_element_binding_1(value) {
    		/*textboxbutton1_element_binding_1*/ ctx[29](value);
    	}

    	let textboxbutton1_props = {
    		tabindex: "-1",
    		"aria-label": "Decrease number",
    		class: "number-box-spinner",
    		disabled: /*spinDownButtonDisabled*/ ctx[15],
    		$$slots: { default: [create_default_slot_2$3] },
    		$$scope: { ctx }
    	};

    	if (/*spinDownButtonElement*/ ctx[6] !== void 0) {
    		textboxbutton1_props.element = /*spinDownButtonElement*/ ctx[6];
    	}

    	textboxbutton1 = new TextBoxButton({
    			props: textboxbutton1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton1, 'element', textboxbutton1_element_binding_1));
    	textboxbutton1.$on("mousedown", /*spinDown*/ ctx[18]);
    	textboxbutton1.$on("mouseup", /*stopSpinIntervals*/ ctx[19]);
    	textboxbutton1.$on("mouseleave", /*stopSpinIntervals*/ ctx[19]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(textboxbutton0.$$.fragment);
    			t = space();
    			create_component(textboxbutton1.$$.fragment);
    			attr_dev(div, "class", "number-box-spinner-flyout svelte-1ipblxo");
    			add_location(div, file$k, 185, 4, 7017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(textboxbutton0, div, null);
    			append_dev(div, t);
    			mount_component(textboxbutton1, div, null);
    			/*div_binding*/ ctx[30](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton0_changes = {};
    			if (dirty[0] & /*spinUpButtonDisabled*/ 65536) textboxbutton0_changes.disabled = /*spinUpButtonDisabled*/ ctx[16];

    			if (dirty[1] & /*$$scope*/ 33554432) {
    				textboxbutton0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*spinUpButtonElement*/ 16) {
    				updating_element = true;
    				textboxbutton0_changes.element = /*spinUpButtonElement*/ ctx[4];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton0.$set(textboxbutton0_changes);
    			const textboxbutton1_changes = {};
    			if (dirty[0] & /*spinDownButtonDisabled*/ 32768) textboxbutton1_changes.disabled = /*spinDownButtonDisabled*/ ctx[15];

    			if (dirty[1] & /*$$scope*/ 33554432) {
    				textboxbutton1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element_1 && dirty[0] & /*spinDownButtonElement*/ 64) {
    				updating_element_1 = true;
    				textboxbutton1_changes.element = /*spinDownButtonElement*/ ctx[6];
    				add_flush_callback(() => updating_element_1 = false);
    			}

    			textboxbutton1.$set(textboxbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton0.$$.fragment, local);
    			transition_in(textboxbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton0.$$.fragment, local);
    			transition_out(textboxbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(textboxbutton0);
    			destroy_component(textboxbutton1);
    			/*div_binding*/ ctx[30](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(185:3) {#if spinnerFlyoutOpen}",
    		ctx
    	});

    	return block;
    }

    // (187:5) <TextBoxButton       on:mousedown={spinUp}       on:mouseup={stopSpinIntervals}       on:mouseleave={stopSpinIntervals}       bind:element={spinUpButtonElement}       class="number-box-spinner"       disabled={spinUpButtonDisabled}       aria-label="Increase number"       tabindex="-1"      >
    function create_default_slot_3$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M3.14645 10.3536C3.34171 10.5488 3.65829 10.5488 3.85355 10.3536L8 6.20711L12.1464 10.3536C12.3417 10.5488 12.6583 10.5488 12.8536 10.3536C13.0488 10.1583 13.0488 9.84171 12.8536 9.64645L8.35355 5.14645C8.15829 4.95118 7.84171 4.95118 7.64645 5.14645L3.14645 9.64645C2.95118 9.84171 2.95118 10.1583 3.14645 10.3536Z");
    			add_location(path, file$k, 203, 7, 7547);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			add_location(svg, file$k, 196, 6, 7395);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(187:5) <TextBoxButton       on:mousedown={spinUp}       on:mouseup={stopSpinIntervals}       on:mouseleave={stopSpinIntervals}       bind:element={spinUpButtonElement}       class=\\\"number-box-spinner\\\"       disabled={spinUpButtonDisabled}       aria-label=\\\"Increase number\\\"       tabindex=\\\"-1\\\"      >",
    		ctx
    	});

    	return block;
    }

    // (210:5) <TextBoxButton       on:mousedown={spinDown}       on:mouseup={stopSpinIntervals}       on:mouseleave={stopSpinIntervals}       bind:element={spinDownButtonElement}       tabindex="-1"       aria-label="Decrease number"       class="number-box-spinner"       disabled={spinDownButtonDisabled}      >
    function create_default_slot_2$3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M3.14645 5.64645C3.34171 5.45118 3.65829 5.45118 3.85355 5.64645L8 9.79289L12.1464 5.64645C12.3417 5.45118 12.6583 5.45118 12.8536 5.64645C13.0488 5.84171 13.0488 6.15829 12.8536 6.35355L8.35355 10.8536C8.15829 11.0488 7.84171 11.0488 7.64645 10.8536L3.14645 6.35355C2.95118 6.15829 2.95118 5.84171 3.14645 5.64645Z");
    			add_location(path, file$k, 226, 7, 8417);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "16");
    			attr_dev(svg, "height", "16");
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			add_location(svg, file$k, 219, 6, 8265);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(210:5) <TextBoxButton       on:mousedown={spinDown}       on:mouseup={stopSpinIntervals}       on:mouseleave={stopSpinIntervals}       bind:element={spinDownButtonElement}       tabindex=\\\"-1\\\"       aria-label=\\\"Decrease number\\\"       class=\\\"number-box-spinner\\\"       disabled={spinDownButtonDisabled}      >",
    		ctx
    	});

    	return block;
    }

    // (117:3) {#if !disabled}
    function create_if_block_1$7(ctx) {
    	let textboxbutton0;
    	let updating_element;
    	let t;
    	let textboxbutton1;
    	let updating_element_1;
    	let current;

    	function textboxbutton0_element_binding(value) {
    		/*textboxbutton0_element_binding*/ ctx[25](value);
    	}

    	let textboxbutton0_props = {
    		tabindex: "-1",
    		"aria-label": "Increase number",
    		disabled: /*spinUpButtonDisabled*/ ctx[16],
    		class: "number-box-spinner",
    		$$slots: { default: [create_default_slot_1$6] },
    		$$scope: { ctx }
    	};

    	if (/*spinUpButtonElement*/ ctx[4] !== void 0) {
    		textboxbutton0_props.element = /*spinUpButtonElement*/ ctx[4];
    	}

    	textboxbutton0 = new TextBoxButton({
    			props: textboxbutton0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton0, 'element', textboxbutton0_element_binding));
    	textboxbutton0.$on("mousedown", /*spinUp*/ ctx[17]);
    	textboxbutton0.$on("mouseup", /*stopSpinIntervals*/ ctx[19]);
    	textboxbutton0.$on("mouseleave", /*stopSpinIntervals*/ ctx[19]);

    	function textboxbutton1_element_binding(value) {
    		/*textboxbutton1_element_binding*/ ctx[26](value);
    	}

    	let textboxbutton1_props = {
    		tabindex: "-1",
    		"aria-label": "Decrease number",
    		class: "number-box-spinner",
    		disabled: /*spinDownButtonDisabled*/ ctx[15],
    		$$slots: { default: [create_default_slot$c] },
    		$$scope: { ctx }
    	};

    	if (/*spinDownButtonElement*/ ctx[6] !== void 0) {
    		textboxbutton1_props.element = /*spinDownButtonElement*/ ctx[6];
    	}

    	textboxbutton1 = new TextBoxButton({
    			props: textboxbutton1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(textboxbutton1, 'element', textboxbutton1_element_binding));
    	textboxbutton1.$on("mousedown", /*spinDown*/ ctx[18]);
    	textboxbutton1.$on("mouseup", /*stopSpinIntervals*/ ctx[19]);
    	textboxbutton1.$on("mouseleave", /*stopSpinIntervals*/ ctx[19]);

    	const block = {
    		c: function create() {
    			create_component(textboxbutton0.$$.fragment);
    			t = space();
    			create_component(textboxbutton1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textboxbutton0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(textboxbutton1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textboxbutton0_changes = {};
    			if (dirty[0] & /*spinUpButtonDisabled*/ 65536) textboxbutton0_changes.disabled = /*spinUpButtonDisabled*/ ctx[16];

    			if (dirty[1] & /*$$scope*/ 33554432) {
    				textboxbutton0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*spinUpButtonElement*/ 16) {
    				updating_element = true;
    				textboxbutton0_changes.element = /*spinUpButtonElement*/ ctx[4];
    				add_flush_callback(() => updating_element = false);
    			}

    			textboxbutton0.$set(textboxbutton0_changes);
    			const textboxbutton1_changes = {};
    			if (dirty[0] & /*spinDownButtonDisabled*/ 32768) textboxbutton1_changes.disabled = /*spinDownButtonDisabled*/ ctx[15];

    			if (dirty[1] & /*$$scope*/ 33554432) {
    				textboxbutton1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element_1 && dirty[0] & /*spinDownButtonElement*/ 64) {
    				updating_element_1 = true;
    				textboxbutton1_changes.element = /*spinDownButtonElement*/ ctx[6];
    				add_flush_callback(() => updating_element_1 = false);
    			}

    			textboxbutton1.$set(textboxbutton1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textboxbutton0.$$.fragment, local);
    			transition_in(textboxbutton1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textboxbutton0.$$.fragment, local);
    			transition_out(textboxbutton1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textboxbutton0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(textboxbutton1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$7.name,
    		type: "if",
    		source: "(117:3) {#if !disabled}",
    		ctx
    	});

    	return block;
    }

    // (118:4) <TextBoxButton      on:mousedown={spinUp}      on:mouseup={stopSpinIntervals}      on:mouseleave={stopSpinIntervals}      bind:element={spinUpButtonElement}      tabindex="-1"      aria-label="Increase number"      disabled={spinUpButtonDisabled}      class="number-box-spinner"     >
    function create_default_slot_1$6(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M2.14645 7.35355C2.34171 7.54882 2.65829 7.54882 2.85355 7.35355L6 4.20711L9.14645 7.35355C9.34171 7.54882 9.65829 7.54882 9.85355 7.35355C10.0488 7.15829 10.0488 6.84171 9.85355 6.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645L2.14645 6.64645C1.95118 6.84171 1.95118 7.15829 2.14645 7.35355Z");
    			add_location(path, file$k, 134, 6, 4518);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			add_location(svg, file$k, 127, 5, 4373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$6.name,
    		type: "slot",
    		source: "(118:4) <TextBoxButton      on:mousedown={spinUp}      on:mouseup={stopSpinIntervals}      on:mouseleave={stopSpinIntervals}      bind:element={spinUpButtonElement}      tabindex=\\\"-1\\\"      aria-label=\\\"Increase number\\\"      disabled={spinUpButtonDisabled}      class=\\\"number-box-spinner\\\"     >",
    		ctx
    	});

    	return block;
    }

    // (141:4) <TextBoxButton      on:mousedown={spinDown}      on:mouseup={stopSpinIntervals}      on:mouseleave={stopSpinIntervals}      bind:element={spinDownButtonElement}      tabindex="-1"      aria-label="Decrease number"      class="number-box-spinner"      disabled={spinDownButtonDisabled}     >
    function create_default_slot$c(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M2.14645 4.64645C2.34171 4.45118 2.65829 4.45118 2.85355 4.64645L6 7.79289L9.14645 4.64645C9.34171 4.45118 9.65829 4.45118 9.85355 4.64645C10.0488 4.84171 10.0488 5.15829 9.85355 5.35355L6.35355 8.85355C6.15829 9.04882 5.84171 9.04882 5.64645 8.85355L2.14645 5.35355C1.95118 5.15829 1.95118 4.84171 2.14645 4.64645Z");
    			add_location(path, file$k, 157, 6, 5365);
    			attr_dev(svg, "aria-hidden", "true");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			add_location(svg, file$k, 150, 5, 5220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$c.name,
    		type: "slot",
    		source: "(141:4) <TextBoxButton      on:mousedown={spinDown}      on:mouseup={stopSpinIntervals}      on:mouseleave={stopSpinIntervals}      bind:element={spinDownButtonElement}      tabindex=\\\"-1\\\"      aria-label=\\\"Decrease number\\\"      class=\\\"number-box-spinner\\\"      disabled={spinDownButtonDisabled}     >",
    		ctx
    	});

    	return block;
    }

    // (115:1) <svelte:fragment slot="buttons">
    function create_buttons_slot$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block$d, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*inline*/ ctx[8]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const buttons_slot_template = /*#slots*/ ctx[24].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[56], get_buttons_slot_context$1);

    	const block = {
    		c: function create() {
    			if_block.c();
    			t = space();
    			if (buttons_slot) buttons_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (buttons_slot) {
    				buttons_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(t.parentNode, t);
    			}

    			if (buttons_slot) {
    				if (buttons_slot.p && (!current || dirty[1] & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						buttons_slot,
    						buttons_slot_template,
    						ctx,
    						/*$$scope*/ ctx[56],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[56])
    						: get_slot_changes(buttons_slot_template, /*$$scope*/ ctx[56], dirty, get_buttons_slot_changes$1),
    						get_buttons_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(buttons_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(buttons_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(t);
    			if (buttons_slot) buttons_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot$1.name,
    		type: "slot",
    		source: "(115:1) <svelte:fragment slot=\\\"buttons\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let textbox;
    	let updating_inputElement;
    	let updating_containerElement;
    	let updating_buttonsContainerElement;
    	let updating_clearButtonElement;
    	let updating_value;
    	let current;
    	let mounted;
    	let dispose;

    	const textbox_spread_levels = [
    		{
    			class: "number-box " + (/*className*/ ctx[13] ?? '')
    		},
    		{ type: "number" },
    		{ min: /*min*/ ctx[9] },
    		{ max: /*max*/ ctx[10] },
    		{ step: /*step*/ ctx[11] },
    		{ disabled: /*disabled*/ ctx[12] },
    		/*$$restProps*/ ctx[21]
    	];

    	function textbox_inputElement_binding(value) {
    		/*textbox_inputElement_binding*/ ctx[31](value);
    	}

    	function textbox_containerElement_binding(value) {
    		/*textbox_containerElement_binding*/ ctx[32](value);
    	}

    	function textbox_buttonsContainerElement_binding(value) {
    		/*textbox_buttonsContainerElement_binding*/ ctx[33](value);
    	}

    	function textbox_clearButtonElement_binding(value) {
    		/*textbox_clearButtonElement_binding*/ ctx[34](value);
    	}

    	function textbox_value_binding(value) {
    		/*textbox_value_binding*/ ctx[35](value);
    	}

    	let textbox_props = {
    		$$slots: {
    			buttons: [create_buttons_slot$1],
    			default: [create_default_slot_5]
    		},
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < textbox_spread_levels.length; i += 1) {
    		textbox_props = assign(textbox_props, textbox_spread_levels[i]);
    	}

    	if (/*inputElement*/ ctx[1] !== void 0) {
    		textbox_props.inputElement = /*inputElement*/ ctx[1];
    	}

    	if (/*containerElement*/ ctx[2] !== void 0) {
    		textbox_props.containerElement = /*containerElement*/ ctx[2];
    	}

    	if (/*buttonsContainerElement*/ ctx[3] !== void 0) {
    		textbox_props.buttonsContainerElement = /*buttonsContainerElement*/ ctx[3];
    	}

    	if (/*clearButtonElement*/ ctx[5] !== void 0) {
    		textbox_props.clearButtonElement = /*clearButtonElement*/ ctx[5];
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		textbox_props.value = /*value*/ ctx[0];
    	}

    	textbox = new TextBox({ props: textbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox, 'inputElement', textbox_inputElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'containerElement', textbox_containerElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'buttonsContainerElement', textbox_buttonsContainerElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'clearButtonElement', textbox_clearButtonElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'value', textbox_value_binding));
    	textbox.$on("outermousedown", /*outermousedown_handler*/ ctx[36]);
    	textbox.$on("change", /*change_handler*/ ctx[37]);
    	textbox.$on("input", /*input_handler*/ ctx[38]);
    	textbox.$on("beforeinput", /*beforeinput_handler*/ ctx[39]);
    	textbox.$on("click", /*click_handler*/ ctx[40]);
    	textbox.$on("blur", /*blur_handler*/ ctx[41]);
    	textbox.$on("focus", /*focus_handler_1*/ ctx[42]);
    	textbox.$on("focus", /*focus_handler*/ ctx[43]);
    	textbox.$on("dblclick", /*dblclick_handler*/ ctx[44]);
    	textbox.$on("contextmenu", /*contextmenu_handler*/ ctx[45]);
    	textbox.$on("mousedown", /*mousedown_handler*/ ctx[46]);
    	textbox.$on("mouseup", /*mouseup_handler*/ ctx[47]);
    	textbox.$on("mouseover", /*mouseover_handler*/ ctx[48]);
    	textbox.$on("mouseout", /*mouseout_handler*/ ctx[49]);
    	textbox.$on("mouseenter", /*mouseenter_handler*/ ctx[50]);
    	textbox.$on("mouseleave", /*mouseleave_handler*/ ctx[51]);
    	textbox.$on("keypress", /*keypress_handler*/ ctx[52]);
    	textbox.$on("keydown", /*keydown_handler*/ ctx[53]);
    	textbox.$on("keyup", /*keyup_handler*/ ctx[54]);
    	textbox.$on("clear", /*clear_handler*/ ctx[55]);

    	const block = {
    		c: function create() {
    			create_component(textbox.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(textbox, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleTabKey*/ ctx[20], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const textbox_changes = (dirty[0] & /*className, min, max, step, disabled, $$restProps*/ 2113024)
    			? get_spread_update(textbox_spread_levels, [
    					dirty[0] & /*className*/ 8192 && {
    						class: "number-box " + (/*className*/ ctx[13] ?? '')
    					},
    					textbox_spread_levels[1],
    					dirty[0] & /*min*/ 512 && { min: /*min*/ ctx[9] },
    					dirty[0] & /*max*/ 1024 && { max: /*max*/ ctx[10] },
    					dirty[0] & /*step*/ 2048 && { step: /*step*/ ctx[11] },
    					dirty[0] & /*disabled*/ 4096 && { disabled: /*disabled*/ ctx[12] },
    					dirty[0] & /*$$restProps*/ 2097152 && get_spread_object(/*$$restProps*/ ctx[21])
    				])
    			: {};

    			if (dirty[0] & /*spinDownButtonDisabled, spinDownButtonElement, spinUpButtonDisabled, spinUpButtonElement, disabled, inline, spinnerFlyoutElement, spinnerFlyoutOpen, inputElement*/ 119250 | dirty[1] & /*$$scope*/ 33554432) {
    				textbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_inputElement && dirty[0] & /*inputElement*/ 2) {
    				updating_inputElement = true;
    				textbox_changes.inputElement = /*inputElement*/ ctx[1];
    				add_flush_callback(() => updating_inputElement = false);
    			}

    			if (!updating_containerElement && dirty[0] & /*containerElement*/ 4) {
    				updating_containerElement = true;
    				textbox_changes.containerElement = /*containerElement*/ ctx[2];
    				add_flush_callback(() => updating_containerElement = false);
    			}

    			if (!updating_buttonsContainerElement && dirty[0] & /*buttonsContainerElement*/ 8) {
    				updating_buttonsContainerElement = true;
    				textbox_changes.buttonsContainerElement = /*buttonsContainerElement*/ ctx[3];
    				add_flush_callback(() => updating_buttonsContainerElement = false);
    			}

    			if (!updating_clearButtonElement && dirty[0] & /*clearButtonElement*/ 32) {
    				updating_clearButtonElement = true;
    				textbox_changes.clearButtonElement = /*clearButtonElement*/ ctx[5];
    				add_flush_callback(() => updating_clearButtonElement = false);
    			}

    			if (!updating_value && dirty[0] & /*value*/ 1) {
    				updating_value = true;
    				textbox_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			textbox.$set(textbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textbox, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let spinUpButtonDisabled;
    	let spinDownButtonDisabled;

    	const omit_props_names = [
    		"inline","value","min","max","step","disabled","class","inputElement","containerElement","buttonsContainerElement","spinUpButtonElement","clearButtonElement","spinDownButtonElement","spinnerFlyoutElement","stepUp","stepDown"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NumberBox', slots, ['buttons','default']);
    	let { inline = false } = $$props;
    	let { value = "" } = $$props;
    	let { min = undefined } = $$props;
    	let { max = undefined } = $$props;
    	let { step = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	let { buttonsContainerElement = null } = $$props;
    	let { spinUpButtonElement = null } = $$props;
    	let { clearButtonElement = null } = $$props;
    	let { spinDownButtonElement = null } = $$props;
    	let { spinnerFlyoutElement = null } = $$props;
    	let spinUpTimeout;
    	let spinDownTimeout;
    	let spinUpInterval;
    	let spinDownInterval;
    	let spinnerFlyoutOpen = false;

    	function spinUp() {
    		stepUp();

    		spinUpTimeout = setTimeout(
    			() => {
    				spinUpInterval = setInterval(
    					() => {
    						stepUp();
    					},
    					50
    				);
    			},
    			500
    		);
    	}

    	function spinDown() {
    		stepDown();

    		spinDownTimeout = setTimeout(
    			() => {
    				spinDownInterval = setInterval(
    					() => {
    						stepDown();
    					},
    					50
    				);
    			},
    			500
    		);
    	}

    	function stopSpinIntervals() {
    		clearTimeout(spinUpTimeout);
    		clearInterval(spinUpInterval);
    		clearTimeout(spinDownTimeout);
    		clearInterval(spinDownInterval);
    	}

    	function handleTabKey({ key }) {
    		if (key === "Tab") $$invalidate(14, spinnerFlyoutOpen = false);
    	}

    	function stepUp() {
    		inputElement.stepUp();
    		$$invalidate(0, value = inputElement.value);
    	}

    	function stepDown() {
    		inputElement.stepDown();
    		$$invalidate(0, value = inputElement.value);
    	}

    	function textboxbutton0_element_binding(value) {
    		spinUpButtonElement = value;
    		$$invalidate(4, spinUpButtonElement);
    	}

    	function textboxbutton1_element_binding(value) {
    		spinDownButtonElement = value;
    		$$invalidate(6, spinDownButtonElement);
    	}

    	const mousedown_handler_1 = () => inputElement.focus();

    	function textboxbutton0_element_binding_1(value) {
    		spinUpButtonElement = value;
    		$$invalidate(4, spinUpButtonElement);
    	}

    	function textboxbutton1_element_binding_1(value) {
    		spinDownButtonElement = value;
    		$$invalidate(6, spinDownButtonElement);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			spinnerFlyoutElement = $$value;
    			$$invalidate(7, spinnerFlyoutElement);
    		});
    	}

    	function textbox_inputElement_binding(value) {
    		inputElement = value;
    		$$invalidate(1, inputElement);
    	}

    	function textbox_containerElement_binding(value) {
    		containerElement = value;
    		$$invalidate(2, containerElement);
    	}

    	function textbox_buttonsContainerElement_binding(value) {
    		buttonsContainerElement = value;
    		$$invalidate(3, buttonsContainerElement);
    	}

    	function textbox_clearButtonElement_binding(value) {
    		clearButtonElement = value;
    		$$invalidate(5, clearButtonElement);
    	}

    	function textbox_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	const outermousedown_handler = () => $$invalidate(14, spinnerFlyoutOpen = false);

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const focus_handler_1 = () => $$invalidate(14, spinnerFlyoutOpen = true);

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dblclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function clear_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(21, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('inline' in $$new_props) $$invalidate(8, inline = $$new_props.inline);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('min' in $$new_props) $$invalidate(9, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(10, max = $$new_props.max);
    		if ('step' in $$new_props) $$invalidate(11, step = $$new_props.step);
    		if ('disabled' in $$new_props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(13, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$new_props) $$invalidate(3, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('spinUpButtonElement' in $$new_props) $$invalidate(4, spinUpButtonElement = $$new_props.spinUpButtonElement);
    		if ('clearButtonElement' in $$new_props) $$invalidate(5, clearButtonElement = $$new_props.clearButtonElement);
    		if ('spinDownButtonElement' in $$new_props) $$invalidate(6, spinDownButtonElement = $$new_props.spinDownButtonElement);
    		if ('spinnerFlyoutElement' in $$new_props) $$invalidate(7, spinnerFlyoutElement = $$new_props.spinnerFlyoutElement);
    		if ('$$scope' in $$new_props) $$invalidate(56, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		TextBox,
    		TextBoxButton,
    		inline,
    		value,
    		min,
    		max,
    		step,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		spinUpButtonElement,
    		clearButtonElement,
    		spinDownButtonElement,
    		spinnerFlyoutElement,
    		spinUpTimeout,
    		spinDownTimeout,
    		spinUpInterval,
    		spinDownInterval,
    		spinnerFlyoutOpen,
    		spinUp,
    		spinDown,
    		stopSpinIntervals,
    		handleTabKey,
    		stepUp,
    		stepDown,
    		spinDownButtonDisabled,
    		spinUpButtonDisabled
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('inline' in $$props) $$invalidate(8, inline = $$new_props.inline);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('min' in $$props) $$invalidate(9, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(10, max = $$new_props.max);
    		if ('step' in $$props) $$invalidate(11, step = $$new_props.step);
    		if ('disabled' in $$props) $$invalidate(12, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(13, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(1, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(2, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$props) $$invalidate(3, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('spinUpButtonElement' in $$props) $$invalidate(4, spinUpButtonElement = $$new_props.spinUpButtonElement);
    		if ('clearButtonElement' in $$props) $$invalidate(5, clearButtonElement = $$new_props.clearButtonElement);
    		if ('spinDownButtonElement' in $$props) $$invalidate(6, spinDownButtonElement = $$new_props.spinDownButtonElement);
    		if ('spinnerFlyoutElement' in $$props) $$invalidate(7, spinnerFlyoutElement = $$new_props.spinnerFlyoutElement);
    		if ('spinUpTimeout' in $$props) spinUpTimeout = $$new_props.spinUpTimeout;
    		if ('spinDownTimeout' in $$props) spinDownTimeout = $$new_props.spinDownTimeout;
    		if ('spinUpInterval' in $$props) spinUpInterval = $$new_props.spinUpInterval;
    		if ('spinDownInterval' in $$props) spinDownInterval = $$new_props.spinDownInterval;
    		if ('spinnerFlyoutOpen' in $$props) $$invalidate(14, spinnerFlyoutOpen = $$new_props.spinnerFlyoutOpen);
    		if ('spinDownButtonDisabled' in $$props) $$invalidate(15, spinDownButtonDisabled = $$new_props.spinDownButtonDisabled);
    		if ('spinUpButtonDisabled' in $$props) $$invalidate(16, spinUpButtonDisabled = $$new_props.spinUpButtonDisabled);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value, max, min*/ 1537) {
    			if ((value === null || value === void 0
    			? void 0
    			: value.toString()) === (max === null || max === void 0 ? void 0 : max.toString()) || (value === null || value === void 0
    			? void 0
    			: value.toString()) === (min === null || min === void 0 ? void 0 : min.toString())) stopSpinIntervals();
    		}

    		if ($$self.$$.dirty[0] & /*disabled, value, max*/ 5121) {
    			$$invalidate(16, spinUpButtonDisabled = disabled || (value === null || value === void 0
    			? void 0
    			: value.toString()) === (max === null || max === void 0 ? void 0 : max.toString()));
    		}

    		if ($$self.$$.dirty[0] & /*disabled, value, min*/ 4609) {
    			$$invalidate(15, spinDownButtonDisabled = disabled || (value === null || value === void 0
    			? void 0
    			: value.toString()) === (min === null || min === void 0 ? void 0 : min.toString()));
    		}
    	};

    	return [
    		value,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		spinUpButtonElement,
    		clearButtonElement,
    		spinDownButtonElement,
    		spinnerFlyoutElement,
    		inline,
    		min,
    		max,
    		step,
    		disabled,
    		className,
    		spinnerFlyoutOpen,
    		spinDownButtonDisabled,
    		spinUpButtonDisabled,
    		spinUp,
    		spinDown,
    		stopSpinIntervals,
    		handleTabKey,
    		$$restProps,
    		stepUp,
    		stepDown,
    		slots,
    		textboxbutton0_element_binding,
    		textboxbutton1_element_binding,
    		mousedown_handler_1,
    		textboxbutton0_element_binding_1,
    		textboxbutton1_element_binding_1,
    		div_binding,
    		textbox_inputElement_binding,
    		textbox_containerElement_binding,
    		textbox_buttonsContainerElement_binding,
    		textbox_clearButtonElement_binding,
    		textbox_value_binding,
    		outermousedown_handler,
    		change_handler,
    		input_handler,
    		beforeinput_handler,
    		click_handler,
    		blur_handler,
    		focus_handler_1,
    		focus_handler,
    		dblclick_handler,
    		contextmenu_handler,
    		mousedown_handler,
    		mouseup_handler,
    		mouseover_handler,
    		mouseout_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keypress_handler,
    		keydown_handler,
    		keyup_handler,
    		clear_handler,
    		$$scope
    	];
    }

    class NumberBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$k,
    			create_fragment$k,
    			safe_not_equal,
    			{
    				inline: 8,
    				value: 0,
    				min: 9,
    				max: 10,
    				step: 11,
    				disabled: 12,
    				class: 13,
    				inputElement: 1,
    				containerElement: 2,
    				buttonsContainerElement: 3,
    				spinUpButtonElement: 4,
    				clearButtonElement: 5,
    				spinDownButtonElement: 6,
    				spinnerFlyoutElement: 7,
    				stepUp: 22,
    				stepDown: 23
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NumberBox",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get inline() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inline(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonsContainerElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonsContainerElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinUpButtonElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinUpButtonElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearButtonElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearButtonElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinDownButtonElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinDownButtonElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spinnerFlyoutElement() {
    		throw new Error("<NumberBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spinnerFlyoutElement(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stepUp() {
    		return this.$$.ctx[22];
    	}

    	set stepUp(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stepDown() {
    		return this.$$.ctx[23];
    	}

    	set stepDown(value) {
    		throw new Error("<NumberBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/TextBlock/TextBlock.svelte generated by Svelte v3.59.2 */

    const file$j = "node_modules/fluent-svelte/TextBlock/TextBlock.svelte";

    // (46:0) <svelte:element  this={tag ? tag : map[variant].tag}  class="text-block type-{map[variant].name} {className}"  bind:this={element}  {...$$restProps} >
    function create_dynamic_element$1(ctx) {
    	let svelte_element;
    	let svelte_element_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	let svelte_element_levels = [
    		{
    			class: svelte_element_class_value = "text-block type-" + /*map*/ ctx[4][/*variant*/ ctx[1]].name + " " + /*className*/ ctx[3]
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*tag*/ ctx[2]
    			? /*tag*/ ctx[2]
    			: /*map*/ ctx[4][/*variant*/ ctx[1]].tag);

    			if (default_slot) default_slot.c();

    			set_dynamic_element_data(/*tag*/ ctx[2]
    			? /*tag*/ ctx[2]
    			: /*map*/ ctx[4][/*variant*/ ctx[1]].tag)(svelte_element, svelte_element_data);

    			toggle_class(svelte_element, "svelte-zxj483", true);
    			add_location(svelte_element, file$j, 45, 0, 1003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			/*svelte_element_binding*/ ctx[8](svelte_element);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_dynamic_element_data(/*tag*/ ctx[2]
    			? /*tag*/ ctx[2]
    			: /*map*/ ctx[4][/*variant*/ ctx[1]].tag)(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
    				(!current || dirty & /*variant, className*/ 10 && svelte_element_class_value !== (svelte_element_class_value = "text-block type-" + /*map*/ ctx[4][/*variant*/ ctx[1]].name + " " + /*className*/ ctx[3])) && { class: svelte_element_class_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(svelte_element, "svelte-zxj483", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			/*svelte_element_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element$1.name,
    		type: "child_dynamic_element",
    		source: "(46:0) <svelte:element  this={tag ? tag : map[variant].tag}  class=\\\"text-block type-{map[variant].name} {className}\\\"  bind:this={element}  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let previous_tag = /*tag*/ ctx[2]
    	? /*tag*/ ctx[2]
    	: /*map*/ ctx[4][/*variant*/ ctx[1]].tag;

    	let svelte_element_anchor;
    	let current;

    	validate_dynamic_element(/*tag*/ ctx[2]
    	? /*tag*/ ctx[2]
    	: /*map*/ ctx[4][/*variant*/ ctx[1]].tag);

    	validate_void_dynamic_element(/*tag*/ ctx[2]
    	? /*tag*/ ctx[2]
    	: /*map*/ ctx[4][/*variant*/ ctx[1]].tag);

    	let svelte_element = (/*tag*/ ctx[2]
    	? /*tag*/ ctx[2]
    	: /*map*/ ctx[4][/*variant*/ ctx[1]].tag) && create_dynamic_element$1(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*tag*/ ctx[2]
    			? /*tag*/ ctx[2]
    			: /*map*/ ctx[4][/*variant*/ ctx[1]].tag) {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element$1(ctx);

    					previous_tag = /*tag*/ ctx[2]
    					? /*tag*/ ctx[2]
    					: /*map*/ ctx[4][/*variant*/ ctx[1]].tag;

    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*tag*/ ctx[2]
    				? /*tag*/ ctx[2]
    				: /*map*/ ctx[4][/*variant*/ ctx[1]].tag)) {
    					svelte_element.d(1);

    					validate_dynamic_element(/*tag*/ ctx[2]
    					? /*tag*/ ctx[2]
    					: /*map*/ ctx[4][/*variant*/ ctx[1]].tag);

    					validate_void_dynamic_element(/*tag*/ ctx[2]
    					? /*tag*/ ctx[2]
    					: /*map*/ ctx[4][/*variant*/ ctx[1]].tag);

    					svelte_element = create_dynamic_element$1(ctx);

    					previous_tag = /*tag*/ ctx[2]
    					? /*tag*/ ctx[2]
    					: /*map*/ ctx[4][/*variant*/ ctx[1]].tag;

    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;

    				previous_tag = /*tag*/ ctx[2]
    				? /*tag*/ ctx[2]
    				: /*map*/ ctx[4][/*variant*/ ctx[1]].tag;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const omit_props_names = ["variant","tag","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TextBlock', slots, ['default']);
    	let { variant = "body" } = $$props;
    	let { tag = undefined } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;

    	const map = {
    		caption: { tag: "span", name: "caption" },
    		body: { tag: "span", name: "body" },
    		bodyStrong: { tag: "h5", name: "body-strong" },
    		bodyLarge: { tag: "h5", name: "body-large" },
    		subtitle: { tag: "h4", name: "subtitle" },
    		title: { tag: "h3", name: "title" },
    		titleLarge: { tag: "h2", name: "title-large" },
    		display: { tag: "h1", name: "display" }
    	};

    	function svelte_element_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('variant' in $$new_props) $$invalidate(1, variant = $$new_props.variant);
    		if ('tag' in $$new_props) $$invalidate(2, tag = $$new_props.tag);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ variant, tag, className, element, map });

    	$$self.$inject_state = $$new_props => {
    		if ('variant' in $$props) $$invalidate(1, variant = $$new_props.variant);
    		if ('tag' in $$props) $$invalidate(2, tag = $$new_props.tag);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		variant,
    		tag,
    		className,
    		map,
    		$$restProps,
    		$$scope,
    		slots,
    		svelte_element_binding
    	];
    }

    class TextBlock extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { variant: 1, tag: 2, class: 3, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TextBlock",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get variant() {
    		throw new Error("<TextBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<TextBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tag() {
    		throw new Error("<TextBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tag(value) {
    		throw new Error("<TextBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<TextBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<TextBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<TextBlock>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<TextBlock>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ListItem/ListItem.svelte generated by Svelte v3.59.2 */
    const file$i = "node_modules/fluent-svelte/ListItem/ListItem.svelte";
    const get_icon_slot_changes_1$1 = dirty => ({});
    const get_icon_slot_context_1$1 = ctx => ({});
    const get_icon_slot_changes$2 = dirty => ({});
    const get_icon_slot_context$2 = ctx => ({});

    // (56:0) {:else}
    function create_else_block$4(ctx) {
    	let li;
    	let t;
    	let textblock;
    	let li_tabindex_value;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[8].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[11], get_icon_slot_context_1$1);

    	textblock = new TextBlock({
    			props: {
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let li_levels = [
    		{
    			tabindex: li_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0
    		},
    		{ "aria-selected": /*selected*/ ctx[1] },
    		{
    			class: li_class_value = "list-item " + /*className*/ ctx[5]
    		},
    		{ href: /*href*/ ctx[3] },
    		{ role: /*role*/ ctx[4] },
    		/*$$restProps*/ ctx[7]
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (icon_slot) icon_slot.c();
    			t = space();
    			create_component(textblock.$$.fragment);
    			set_attributes(li, li_data);
    			toggle_class(li, "selected", /*selected*/ ctx[1]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(li, "svelte-1ye4o7x", true);
    			add_location(li, file$i, 56, 1, 1898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (icon_slot) {
    				icon_slot.m(li, null);
    			}

    			append_dev(li, t);
    			mount_component(textblock, li, null);
    			/*li_binding*/ ctx[10](li);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[6].call(null, li)),
    					listen_dev(li, "keydown", handleKeyDown, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[11], dirty, get_icon_slot_changes_1$1),
    						get_icon_slot_context_1$1
    					);
    				}
    			}

    			const textblock_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				textblock_changes.$$scope = { dirty, ctx };
    			}

    			textblock.$set(textblock_changes);

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				(!current || dirty & /*disabled*/ 4 && li_tabindex_value !== (li_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0)) && { tabindex: li_tabindex_value },
    				(!current || dirty & /*selected*/ 2) && { "aria-selected": /*selected*/ ctx[1] },
    				(!current || dirty & /*className*/ 32 && li_class_value !== (li_class_value = "list-item " + /*className*/ ctx[5])) && { class: li_class_value },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*role*/ 16) && { role: /*role*/ ctx[4] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(li, "selected", /*selected*/ ctx[1]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(li, "svelte-1ye4o7x", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(textblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(textblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (icon_slot) icon_slot.d(detaching);
    			destroy_component(textblock);
    			/*li_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(56:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:0) {#if href && !disabled}
    function create_if_block$c(ctx) {
    	let a;
    	let t;
    	let textblock;
    	let a_tabindex_value;
    	let a_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[8].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[11], get_icon_slot_context$2);

    	textblock = new TextBlock({
    			props: {
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let a_levels = [
    		{
    			tabindex: a_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0
    		},
    		{ "aria-selected": /*selected*/ ctx[1] },
    		{
    			class: a_class_value = "list-item " + /*className*/ ctx[5]
    		},
    		{ href: /*href*/ ctx[3] },
    		{ role: /*role*/ ctx[4] },
    		/*$$restProps*/ ctx[7]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (icon_slot) icon_slot.c();
    			t = space();
    			create_component(textblock.$$.fragment);
    			set_attributes(a, a_data);
    			toggle_class(a, "selected", /*selected*/ ctx[1]);
    			toggle_class(a, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(a, "svelte-1ye4o7x", true);
    			add_location(a, file$i, 37, 1, 1581);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (icon_slot) {
    				icon_slot.m(a, null);
    			}

    			append_dev(a, t);
    			mount_component(textblock, a, null);
    			/*a_binding*/ ctx[9](a);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[6].call(null, a)),
    					listen_dev(a, "keydown", handleKeyDown, false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[11], dirty, get_icon_slot_changes$2),
    						get_icon_slot_context$2
    					);
    				}
    			}

    			const textblock_changes = {};

    			if (dirty & /*$$scope*/ 2048) {
    				textblock_changes.$$scope = { dirty, ctx };
    			}

    			textblock.$set(textblock_changes);

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*disabled*/ 4 && a_tabindex_value !== (a_tabindex_value = /*disabled*/ ctx[2] ? -1 : 0)) && { tabindex: a_tabindex_value },
    				(!current || dirty & /*selected*/ 2) && { "aria-selected": /*selected*/ ctx[1] },
    				(!current || dirty & /*className*/ 32 && a_class_value !== (a_class_value = "list-item " + /*className*/ ctx[5])) && { class: a_class_value },
    				(!current || dirty & /*href*/ 8) && { href: /*href*/ ctx[3] },
    				(!current || dirty & /*role*/ 16) && { role: /*role*/ ctx[4] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(a, "selected", /*selected*/ ctx[1]);
    			toggle_class(a, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(a, "svelte-1ye4o7x", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(textblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(textblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (icon_slot) icon_slot.d(detaching);
    			destroy_component(textblock);
    			/*a_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$c.name,
    		type: "if",
    		source: "(37:0) {#if href && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (71:2) <TextBlock>
    function create_default_slot_1$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(71:2) <TextBlock>",
    		ctx
    	});

    	return block;
    }

    // (52:2) <TextBlock>
    function create_default_slot$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(52:2) <TextBlock>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$c, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[3] && !/*disabled*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleKeyDown({ key, target }) {
    	if (key === "Enter") target.click();
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const omit_props_names = ["selected","disabled","href","role","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ListItem', slots, ['icon','default']);
    	let { selected = false } = $$props;
    	let { disabled = false } = $$props;
    	let { href = "" } = $$props;
    	let { role = "listitem" } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component(), ["select"]);
    	const dispatch = createEventDispatcher();

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('selected' in $$new_props) $$invalidate(1, selected = $$new_props.selected);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$new_props) $$invalidate(3, href = $$new_props.href);
    		if ('role' in $$new_props) $$invalidate(4, role = $$new_props.role);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		get_current_component,
    		createEventForwarder,
    		TextBlock,
    		selected,
    		disabled,
    		href,
    		role,
    		className,
    		element,
    		forwardEvents,
    		dispatch,
    		handleKeyDown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('selected' in $$props) $$invalidate(1, selected = $$new_props.selected);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('href' in $$props) $$invalidate(3, href = $$new_props.href);
    		if ('role' in $$props) $$invalidate(4, role = $$new_props.role);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*selected*/ 2) {
    			if (selected) dispatch("select");
    		}
    	};

    	return [
    		element,
    		selected,
    		disabled,
    		href,
    		role,
    		className,
    		forwardEvents,
    		$$restProps,
    		slots,
    		a_binding,
    		li_binding,
    		$$scope
    	];
    }

    class ListItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			selected: 1,
    			disabled: 2,
    			href: 3,
    			role: 4,
    			class: 5,
    			element: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ListItem",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get selected() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get role() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set role(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<ListItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<ListItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/AutoSuggestBox/AutoSuggestBox.svelte generated by Svelte v3.59.2 */
    const file$h = "node_modules/fluent-svelte/AutoSuggestBox/AutoSuggestBox.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[54] = list[i];
    	child_ctx[56] = i;
    	return child_ctx;
    }

    const get_item_template_slot_changes = dirty => ({
    	id: dirty[0] & /*matches*/ 8,
    	value: dirty[0] & /*value*/ 2,
    	matches: dirty[0] & /*matches*/ 8,
    	selection: dirty[0] & /*selection*/ 1,
    	item: dirty[0] & /*matches*/ 8,
    	index: dirty[0] & /*matches*/ 8
    });

    const get_item_template_slot_context = ctx => ({
    	id: "" + (/*flyoutId*/ ctx[14] + "-item-" + /*index*/ ctx[56]),
    	value: /*value*/ ctx[1],
    	matches: /*matches*/ ctx[3],
    	selection: /*selection*/ ctx[0],
    	item: /*item*/ ctx[54],
    	index: /*index*/ ctx[56]
    });

    const get_buttons_slot_changes = dirty => ({});
    const get_buttons_slot_context = ctx => ({ slot: "buttons" });

    // (123:1) {#if open && matches.length > 0}
    function create_if_block$b(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*matches*/ ctx[3];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[54];
    	validate_each_keys(ctx, each_value, get_each_context$3, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$3(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$3(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "id", /*flyoutId*/ ctx[14]);
    			attr_dev(ul, "role", "listbox");
    			attr_dev(ul, "class", "auto-suggest-box-flyout svelte-11bcpbh");
    			add_location(ul, file$h, 123, 2, 4089);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			/*ul_binding*/ ctx[20](ul);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*flyoutId, matches, selection, value, open*/ 16399 | dirty[1] & /*$$scope*/ 1048576) {
    				each_value = /*matches*/ ctx[3];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$3, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block$3, null, get_each_context$3);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			/*ul_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(123:1) {#if open && matches.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (136:6) <ListItem        tabindex={-1}        id="{flyoutId}-item-{index}"        role="option"        on:click={() => {         value = matches[selection];         selection = index;         open = false;        }}        selected={selection === index}>
    function create_default_slot_1$4(ctx) {
    	let t_value = /*item*/ ctx[54] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*matches*/ 8 && t_value !== (t_value = /*item*/ ctx[54] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(136:6) <ListItem        tabindex={-1}        id=\\\"{flyoutId}-item-{index}\\\"        role=\\\"option\\\"        on:click={() => {         value = matches[selection];         selection = index;         open = false;        }}        selected={selection === index}>",
    		ctx
    	});

    	return block;
    }

    // (135:6)        
    function fallback_block$2(ctx) {
    	let listitem;
    	let current;

    	function click_handler_1() {
    		return /*click_handler_1*/ ctx[19](/*index*/ ctx[56]);
    	}

    	listitem = new ListItem({
    			props: {
    				tabindex: -1,
    				id: "" + (/*flyoutId*/ ctx[14] + "-item-" + /*index*/ ctx[56]),
    				role: "option",
    				selected: /*selection*/ ctx[0] === /*index*/ ctx[56],
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	listitem.$on("click", click_handler_1);

    	const block = {
    		c: function create() {
    			create_component(listitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(listitem, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const listitem_changes = {};
    			if (dirty[0] & /*matches*/ 8) listitem_changes.id = "" + (/*flyoutId*/ ctx[14] + "-item-" + /*index*/ ctx[56]);
    			if (dirty[0] & /*selection, matches*/ 9) listitem_changes.selected = /*selection*/ ctx[0] === /*index*/ ctx[56];

    			if (dirty[0] & /*matches*/ 8 | dirty[1] & /*$$scope*/ 1048576) {
    				listitem_changes.$$scope = { dirty, ctx };
    			}

    			listitem.$set(listitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(listitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(listitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(listitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$2.name,
    		type: "fallback",
    		source: "(135:6)        ",
    		ctx
    	});

    	return block;
    }

    // (125:3) {#each matches as item, index (item)}
    function create_each_block$3(key_1, ctx) {
    	let div;
    	let t;
    	let current;
    	const item_template_slot_template = /*#slots*/ ctx[18]["item-template"];
    	const item_template_slot = create_slot(item_template_slot_template, ctx, /*$$scope*/ ctx[51], get_item_template_slot_context);
    	const item_template_slot_or_fallback = item_template_slot || fallback_block$2(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			if (item_template_slot_or_fallback) item_template_slot_or_fallback.c();
    			t = space();
    			attr_dev(div, "class", "auto-suggest-item-wrapper svelte-11bcpbh");
    			add_location(div, file$h, 125, 4, 4226);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (item_template_slot_or_fallback) {
    				item_template_slot_or_fallback.m(div, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (item_template_slot) {
    				if (item_template_slot.p && (!current || dirty[0] & /*matches, value, selection*/ 11 | dirty[1] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						item_template_slot,
    						item_template_slot_template,
    						ctx,
    						/*$$scope*/ ctx[51],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[51])
    						: get_slot_changes(item_template_slot_template, /*$$scope*/ ctx[51], dirty, get_item_template_slot_changes),
    						get_item_template_slot_context
    					);
    				}
    			} else {
    				if (item_template_slot_or_fallback && item_template_slot_or_fallback.p && (!current || dirty[0] & /*matches, selection, value, open*/ 15)) {
    					item_template_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(item_template_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(item_template_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (item_template_slot_or_fallback) item_template_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(125:3) {#each matches as item, index (item)}",
    		ctx
    	});

    	return block;
    }

    // (75:0) <TextBox  type="search"  class="auto-suggest-box {open && matches.length > 0 ? 'open' : ''} {className}"  aria-autocomplete="list"  aria-activedescendant={open && matches.length > 0   ? `${flyoutId}-item-${items.indexOf(matches[selection])}`   : ""}  aria-expanded={open && matches.length > 0}  aria-controls={flyoutId}  on:search={() => {   if (open && matches.length > 0) value = matches[selection];  }}  on:search  on:input  on:input={handleInput}  on:outermousedown={() => (open = false)}  on:focus={() => (focused = true)}  on:focus  on:blur={() => (focused = false)}  on:blur  on:keydown={handleKeyDown}  on:keydown  on:change  on:beforeinput  on:click  on:dblclick  on:contextmenu  on:mousedown  on:mouseup  on:mouseover  on:mouseout  on:mouseenter  on:mouseleave  on:keypress  on:keyup  on:clear={() => {   typedValue = "";   if (items.length > 0) open = true;  }}  on:clear  bind:inputElement  bind:containerElement  bind:clearButtonElement  bind:searchButtonElement  bind:buttonsContainerElement  bind:value  {...$$restProps} >
    function create_default_slot$a(ctx) {
    	let t;
    	let current;
    	let if_block = /*open*/ ctx[2] && /*matches*/ ctx[3].length > 0 && create_if_block$b(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[51], null);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*open*/ ctx[2] && /*matches*/ ctx[3].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open, matches*/ 12) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[51],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[51])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[51], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(75:0) <TextBox  type=\\\"search\\\"  class=\\\"auto-suggest-box {open && matches.length > 0 ? 'open' : ''} {className}\\\"  aria-autocomplete=\\\"list\\\"  aria-activedescendant={open && matches.length > 0   ? `${flyoutId}-item-${items.indexOf(matches[selection])}`   : \\\"\\\"}  aria-expanded={open && matches.length > 0}  aria-controls={flyoutId}  on:search={() => {   if (open && matches.length > 0) value = matches[selection];  }}  on:search  on:input  on:input={handleInput}  on:outermousedown={() => (open = false)}  on:focus={() => (focused = true)}  on:focus  on:blur={() => (focused = false)}  on:blur  on:keydown={handleKeyDown}  on:keydown  on:change  on:beforeinput  on:click  on:dblclick  on:contextmenu  on:mousedown  on:mouseup  on:mouseover  on:mouseout  on:mouseenter  on:mouseleave  on:keypress  on:keyup  on:clear={() => {   typedValue = \\\"\\\";   if (items.length > 0) open = true;  }}  on:clear  bind:inputElement  bind:containerElement  bind:clearButtonElement  bind:searchButtonElement  bind:buttonsContainerElement  bind:value  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    // (154:1) 
    function create_buttons_slot(ctx) {
    	let current;
    	const buttons_slot_template = /*#slots*/ ctx[18].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[51], get_buttons_slot_context);

    	const block = {
    		c: function create() {
    			if (buttons_slot) buttons_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (buttons_slot) {
    				buttons_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (buttons_slot) {
    				if (buttons_slot.p && (!current || dirty[1] & /*$$scope*/ 1048576)) {
    					update_slot_base(
    						buttons_slot,
    						buttons_slot_template,
    						ctx,
    						/*$$scope*/ ctx[51],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[51])
    						: get_slot_changes(buttons_slot_template, /*$$scope*/ ctx[51], dirty, get_buttons_slot_changes),
    						get_buttons_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(buttons_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(buttons_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (buttons_slot) buttons_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_buttons_slot.name,
    		type: "slot",
    		source: "(154:1) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let textbox;
    	let updating_inputElement;
    	let updating_containerElement;
    	let updating_clearButtonElement;
    	let updating_searchButtonElement;
    	let updating_buttonsContainerElement;
    	let updating_value;
    	let current;

    	const textbox_spread_levels = [
    		{ type: "search" },
    		{
    			class: "auto-suggest-box " + (/*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    			? 'open'
    			: '') + " " + /*className*/ ctx[11]
    		},
    		{ "aria-autocomplete": "list" },
    		{
    			"aria-activedescendant": /*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    			? `${/*flyoutId*/ ctx[14]}-item-${/*items*/ ctx[10].indexOf(/*matches*/ ctx[3][/*selection*/ ctx[0]])}`
    			: ""
    		},
    		{
    			"aria-expanded": /*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    		},
    		{ "aria-controls": /*flyoutId*/ ctx[14] },
    		/*$$restProps*/ ctx[17]
    	];

    	function textbox_inputElement_binding(value) {
    		/*textbox_inputElement_binding*/ ctx[21](value);
    	}

    	function textbox_containerElement_binding(value) {
    		/*textbox_containerElement_binding*/ ctx[22](value);
    	}

    	function textbox_clearButtonElement_binding(value) {
    		/*textbox_clearButtonElement_binding*/ ctx[23](value);
    	}

    	function textbox_searchButtonElement_binding(value) {
    		/*textbox_searchButtonElement_binding*/ ctx[24](value);
    	}

    	function textbox_buttonsContainerElement_binding(value) {
    		/*textbox_buttonsContainerElement_binding*/ ctx[25](value);
    	}

    	function textbox_value_binding(value) {
    		/*textbox_value_binding*/ ctx[26](value);
    	}

    	let textbox_props = {
    		$$slots: {
    			buttons: [create_buttons_slot],
    			default: [create_default_slot$a]
    		},
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < textbox_spread_levels.length; i += 1) {
    		textbox_props = assign(textbox_props, textbox_spread_levels[i]);
    	}

    	if (/*inputElement*/ ctx[4] !== void 0) {
    		textbox_props.inputElement = /*inputElement*/ ctx[4];
    	}

    	if (/*containerElement*/ ctx[5] !== void 0) {
    		textbox_props.containerElement = /*containerElement*/ ctx[5];
    	}

    	if (/*clearButtonElement*/ ctx[7] !== void 0) {
    		textbox_props.clearButtonElement = /*clearButtonElement*/ ctx[7];
    	}

    	if (/*searchButtonElement*/ ctx[8] !== void 0) {
    		textbox_props.searchButtonElement = /*searchButtonElement*/ ctx[8];
    	}

    	if (/*buttonsContainerElement*/ ctx[6] !== void 0) {
    		textbox_props.buttonsContainerElement = /*buttonsContainerElement*/ ctx[6];
    	}

    	if (/*value*/ ctx[1] !== void 0) {
    		textbox_props.value = /*value*/ ctx[1];
    	}

    	textbox = new TextBox({ props: textbox_props, $$inline: true });
    	binding_callbacks.push(() => bind(textbox, 'inputElement', textbox_inputElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'containerElement', textbox_containerElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'clearButtonElement', textbox_clearButtonElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'searchButtonElement', textbox_searchButtonElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'buttonsContainerElement', textbox_buttonsContainerElement_binding));
    	binding_callbacks.push(() => bind(textbox, 'value', textbox_value_binding));
    	textbox.$on("search", /*search_handler_1*/ ctx[27]);
    	textbox.$on("search", /*search_handler*/ ctx[28]);
    	textbox.$on("input", /*input_handler*/ ctx[29]);
    	textbox.$on("input", /*handleInput*/ ctx[15]);
    	textbox.$on("outermousedown", /*outermousedown_handler*/ ctx[30]);
    	textbox.$on("focus", /*focus_handler_1*/ ctx[31]);
    	textbox.$on("focus", /*focus_handler*/ ctx[32]);
    	textbox.$on("blur", /*blur_handler_1*/ ctx[33]);
    	textbox.$on("blur", /*blur_handler*/ ctx[34]);
    	textbox.$on("keydown", /*handleKeyDown*/ ctx[16]);
    	textbox.$on("keydown", /*keydown_handler*/ ctx[35]);
    	textbox.$on("change", /*change_handler*/ ctx[36]);
    	textbox.$on("beforeinput", /*beforeinput_handler*/ ctx[37]);
    	textbox.$on("click", /*click_handler*/ ctx[38]);
    	textbox.$on("dblclick", /*dblclick_handler*/ ctx[39]);
    	textbox.$on("contextmenu", /*contextmenu_handler*/ ctx[40]);
    	textbox.$on("mousedown", /*mousedown_handler*/ ctx[41]);
    	textbox.$on("mouseup", /*mouseup_handler*/ ctx[42]);
    	textbox.$on("mouseover", /*mouseover_handler*/ ctx[43]);
    	textbox.$on("mouseout", /*mouseout_handler*/ ctx[44]);
    	textbox.$on("mouseenter", /*mouseenter_handler*/ ctx[45]);
    	textbox.$on("mouseleave", /*mouseleave_handler*/ ctx[46]);
    	textbox.$on("keypress", /*keypress_handler*/ ctx[47]);
    	textbox.$on("keyup", /*keyup_handler*/ ctx[48]);
    	textbox.$on("clear", /*clear_handler_1*/ ctx[49]);
    	textbox.$on("clear", /*clear_handler*/ ctx[50]);

    	const block = {
    		c: function create() {
    			create_component(textbox.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(textbox, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textbox_changes = (dirty[0] & /*open, matches, className, flyoutId, items, selection, $$restProps*/ 150541)
    			? get_spread_update(textbox_spread_levels, [
    					textbox_spread_levels[0],
    					dirty[0] & /*open, matches, className*/ 2060 && {
    						class: "auto-suggest-box " + (/*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    						? 'open'
    						: '') + " " + /*className*/ ctx[11]
    					},
    					textbox_spread_levels[2],
    					dirty[0] & /*open, matches, flyoutId, items, selection*/ 17421 && {
    						"aria-activedescendant": /*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    						? `${/*flyoutId*/ ctx[14]}-item-${/*items*/ ctx[10].indexOf(/*matches*/ ctx[3][/*selection*/ ctx[0]])}`
    						: ""
    					},
    					dirty[0] & /*open, matches*/ 12 && {
    						"aria-expanded": /*open*/ ctx[2] && /*matches*/ ctx[3].length > 0
    					},
    					dirty[0] & /*flyoutId*/ 16384 && { "aria-controls": /*flyoutId*/ ctx[14] },
    					dirty[0] & /*$$restProps*/ 131072 && get_spread_object(/*$$restProps*/ ctx[17])
    				])
    			: {};

    			if (dirty[0] & /*flyoutElement, matches, selection, value, open*/ 527 | dirty[1] & /*$$scope*/ 1048576) {
    				textbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_inputElement && dirty[0] & /*inputElement*/ 16) {
    				updating_inputElement = true;
    				textbox_changes.inputElement = /*inputElement*/ ctx[4];
    				add_flush_callback(() => updating_inputElement = false);
    			}

    			if (!updating_containerElement && dirty[0] & /*containerElement*/ 32) {
    				updating_containerElement = true;
    				textbox_changes.containerElement = /*containerElement*/ ctx[5];
    				add_flush_callback(() => updating_containerElement = false);
    			}

    			if (!updating_clearButtonElement && dirty[0] & /*clearButtonElement*/ 128) {
    				updating_clearButtonElement = true;
    				textbox_changes.clearButtonElement = /*clearButtonElement*/ ctx[7];
    				add_flush_callback(() => updating_clearButtonElement = false);
    			}

    			if (!updating_searchButtonElement && dirty[0] & /*searchButtonElement*/ 256) {
    				updating_searchButtonElement = true;
    				textbox_changes.searchButtonElement = /*searchButtonElement*/ ctx[8];
    				add_flush_callback(() => updating_searchButtonElement = false);
    			}

    			if (!updating_buttonsContainerElement && dirty[0] & /*buttonsContainerElement*/ 64) {
    				updating_buttonsContainerElement = true;
    				textbox_changes.buttonsContainerElement = /*buttonsContainerElement*/ ctx[6];
    				add_flush_callback(() => updating_buttonsContainerElement = false);
    			}

    			if (!updating_value && dirty[0] & /*value*/ 2) {
    				updating_value = true;
    				textbox_changes.value = /*value*/ ctx[1];
    				add_flush_callback(() => updating_value = false);
    			}

    			textbox.$set(textbox_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textbox.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textbox.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textbox, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","items","open","selection","matches","class","inputElement","containerElement","buttonsContainerElement","clearButtonElement","searchButtonElement","flyoutElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AutoSuggestBox', slots, ['buttons','item-template','default']);
    	let { value = "" } = $$props;
    	let { items = [] } = $$props;
    	let { open = false } = $$props;
    	let { selection = 0 } = $$props;
    	let { matches = [] } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	let { buttonsContainerElement = null } = $$props;
    	let { clearButtonElement = null } = $$props;
    	let { searchButtonElement = null } = $$props;
    	let { flyoutElement = null } = $$props;
    	let focused = false;
    	let typedValue = "";
    	const dispatch = createEventDispatcher();
    	const flyoutId = uid("fds-auto-suggest-flyout-");

    	function dispatchSelect() {
    		dispatch("select", { item: items[selection], index: selection });
    	}

    	function handleInput() {
    		$$invalidate(12, typedValue = inputElement.value);
    		if (focused && value && items.length > 0) $$invalidate(2, open = true);
    	}

    	function handleKeyDown(event) {
    		const { key } = event;

    		if (open && matches.length > 0) {
    			if (key === "ArrowDown") {
    				$$invalidate(0, selection++, selection);
    				if (selection > matches.length - 1) $$invalidate(0, selection = 0);
    			} else if (key === "ArrowUp") {
    				$$invalidate(0, selection--, selection);
    				if (selection < 0) $$invalidate(0, selection = matches.length - 1);
    			} else if (key === "Enter" || key === "Escape") {
    				$$invalidate(2, open = false);
    			}

    			if (key === "Enter" || key === "ArrowDown" || key === "ArrowUp") {
    				event.preventDefault();
    				$$invalidate(1, value = matches[selection]);

    				flyoutElement === null || flyoutElement === void 0
    				? void 0
    				: flyoutElement.children[selection].scrollIntoView({ block: "nearest" });
    			}
    		} else if (!open && matches.length > 0 && (key === "ArrowDown" || key === "ArrowUp")) {
    			$$invalidate(2, open = true);
    		}
    	}

    	const click_handler_1 = index => {
    		$$invalidate(1, value = matches[selection]);
    		$$invalidate(0, selection = index);
    		$$invalidate(2, open = false);
    	};

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			flyoutElement = $$value;
    			$$invalidate(9, flyoutElement);
    		});
    	}

    	function textbox_inputElement_binding(value) {
    		inputElement = value;
    		$$invalidate(4, inputElement);
    	}

    	function textbox_containerElement_binding(value) {
    		containerElement = value;
    		$$invalidate(5, containerElement);
    	}

    	function textbox_clearButtonElement_binding(value) {
    		clearButtonElement = value;
    		$$invalidate(7, clearButtonElement);
    	}

    	function textbox_searchButtonElement_binding(value) {
    		searchButtonElement = value;
    		$$invalidate(8, searchButtonElement);
    	}

    	function textbox_buttonsContainerElement_binding(value) {
    		buttonsContainerElement = value;
    		$$invalidate(6, buttonsContainerElement);
    	}

    	function textbox_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(1, value);
    	}

    	const search_handler_1 = () => {
    		if (open && matches.length > 0) $$invalidate(1, value = matches[selection]);
    	};

    	function search_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const outermousedown_handler = () => $$invalidate(2, open = false);
    	const focus_handler_1 = () => $$invalidate(13, focused = true);

    	function focus_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const blur_handler_1 = () => $$invalidate(13, focused = false);

    	function blur_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keydown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function dblclick_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mousedown_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseover_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseout_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseenter_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function mouseleave_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keypress_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function keyup_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	const clear_handler_1 = () => {
    		$$invalidate(12, typedValue = "");
    		if (items.length > 0) $$invalidate(2, open = true);
    	};

    	function clear_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(1, value = $$new_props.value);
    		if ('items' in $$new_props) $$invalidate(10, items = $$new_props.items);
    		if ('open' in $$new_props) $$invalidate(2, open = $$new_props.open);
    		if ('selection' in $$new_props) $$invalidate(0, selection = $$new_props.selection);
    		if ('matches' in $$new_props) $$invalidate(3, matches = $$new_props.matches);
    		if ('class' in $$new_props) $$invalidate(11, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(4, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(5, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$new_props) $$invalidate(6, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('clearButtonElement' in $$new_props) $$invalidate(7, clearButtonElement = $$new_props.clearButtonElement);
    		if ('searchButtonElement' in $$new_props) $$invalidate(8, searchButtonElement = $$new_props.searchButtonElement);
    		if ('flyoutElement' in $$new_props) $$invalidate(9, flyoutElement = $$new_props.flyoutElement);
    		if ('$$scope' in $$new_props) $$invalidate(51, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		uid,
    		TextBox,
    		ListItem,
    		value,
    		items,
    		open,
    		selection,
    		matches,
    		className,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		clearButtonElement,
    		searchButtonElement,
    		flyoutElement,
    		focused,
    		typedValue,
    		dispatch,
    		flyoutId,
    		dispatchSelect,
    		handleInput,
    		handleKeyDown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(1, value = $$new_props.value);
    		if ('items' in $$props) $$invalidate(10, items = $$new_props.items);
    		if ('open' in $$props) $$invalidate(2, open = $$new_props.open);
    		if ('selection' in $$props) $$invalidate(0, selection = $$new_props.selection);
    		if ('matches' in $$props) $$invalidate(3, matches = $$new_props.matches);
    		if ('className' in $$props) $$invalidate(11, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(4, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(5, containerElement = $$new_props.containerElement);
    		if ('buttonsContainerElement' in $$props) $$invalidate(6, buttonsContainerElement = $$new_props.buttonsContainerElement);
    		if ('clearButtonElement' in $$props) $$invalidate(7, clearButtonElement = $$new_props.clearButtonElement);
    		if ('searchButtonElement' in $$props) $$invalidate(8, searchButtonElement = $$new_props.searchButtonElement);
    		if ('flyoutElement' in $$props) $$invalidate(9, flyoutElement = $$new_props.flyoutElement);
    		if ('focused' in $$props) $$invalidate(13, focused = $$new_props.focused);
    		if ('typedValue' in $$props) $$invalidate(12, typedValue = $$new_props.typedValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*items, typedValue*/ 5120) {
    			$$invalidate(3, matches = items.filter(item => item.toLowerCase().includes(typedValue.toLowerCase())));
    		}

    		if ($$self.$$.dirty[0] & /*selection*/ 1) {
    			(dispatchSelect());
    		}
    	};

    	return [
    		selection,
    		value,
    		open,
    		matches,
    		inputElement,
    		containerElement,
    		buttonsContainerElement,
    		clearButtonElement,
    		searchButtonElement,
    		flyoutElement,
    		items,
    		className,
    		typedValue,
    		focused,
    		flyoutId,
    		handleInput,
    		handleKeyDown,
    		$$restProps,
    		slots,
    		click_handler_1,
    		ul_binding,
    		textbox_inputElement_binding,
    		textbox_containerElement_binding,
    		textbox_clearButtonElement_binding,
    		textbox_searchButtonElement_binding,
    		textbox_buttonsContainerElement_binding,
    		textbox_value_binding,
    		search_handler_1,
    		search_handler,
    		input_handler,
    		outermousedown_handler,
    		focus_handler_1,
    		focus_handler,
    		blur_handler_1,
    		blur_handler,
    		keydown_handler,
    		change_handler,
    		beforeinput_handler,
    		click_handler,
    		dblclick_handler,
    		contextmenu_handler,
    		mousedown_handler,
    		mouseup_handler,
    		mouseover_handler,
    		mouseout_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		keypress_handler,
    		keyup_handler,
    		clear_handler_1,
    		clear_handler,
    		$$scope
    	];
    }

    class AutoSuggestBox extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$h,
    			create_fragment$h,
    			safe_not_equal,
    			{
    				value: 1,
    				items: 10,
    				open: 2,
    				selection: 0,
    				matches: 3,
    				class: 11,
    				inputElement: 4,
    				containerElement: 5,
    				buttonsContainerElement: 6,
    				clearButtonElement: 7,
    				searchButtonElement: 8,
    				flyoutElement: 9
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AutoSuggestBox",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get value() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selection() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selection(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get matches() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set matches(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get buttonsContainerElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set buttonsContainerElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get clearButtonElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set clearButtonElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get searchButtonElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set searchButtonElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get flyoutElement() {
    		throw new Error("<AutoSuggestBox>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set flyoutElement(value) {
    		throw new Error("<AutoSuggestBox>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Slider/Slider.svelte generated by Svelte v3.59.2 */

    const { window: window_1$1 } = globals;
    const file$g = "node_modules/fluent-svelte/Slider/Slider.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[46] = list[i];
    	return child_ctx;
    }

    const get_tooltip_slot_changes$1 = dirty => ({
    	prefix: dirty[0] & /*prefix*/ 8192,
    	suffix: dirty[0] & /*suffix*/ 16384,
    	value: dirty[0] & /*value*/ 1
    });

    const get_tooltip_slot_context$1 = ctx => ({
    	prefix: /*prefix*/ ctx[13],
    	suffix: /*suffix*/ ctx[14],
    	value: /*value*/ ctx[0]
    });

    // (200:2) {#if tooltip && !disabled}
    function create_if_block_2$3(ctx) {
    	let tooltipsurface;
    	let current;

    	tooltipsurface = new TooltipSurface({
    			props: {
    				class: "slider-tooltip",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tooltipsurface.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tooltipsurface, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tooltipsurface_changes = {};

    			if (dirty[0] & /*suffix, value, prefix*/ 24577 | dirty[1] & /*$$scope*/ 4096) {
    				tooltipsurface_changes.$$scope = { dirty, ctx };
    			}

    			tooltipsurface.$set(tooltipsurface_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltipsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltipsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tooltipsurface, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(200:2) {#if tooltip && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (202:51)       
    function fallback_block$1(ctx) {
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text(/*prefix*/ ctx[13]);
    			t1 = text(/*value*/ ctx[0]);
    			t2 = text(/*suffix*/ ctx[14]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*prefix*/ 8192) set_data_dev(t0, /*prefix*/ ctx[13]);
    			if (dirty[0] & /*value*/ 1) set_data_dev(t1, /*value*/ ctx[0]);
    			if (dirty[0] & /*suffix*/ 16384) set_data_dev(t2, /*suffix*/ ctx[14]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(202:51)       ",
    		ctx
    	});

    	return block;
    }

    // (201:3) <TooltipSurface class="slider-tooltip">
    function create_default_slot$9(ctx) {
    	let current;
    	const tooltip_slot_template = /*#slots*/ ctx[34].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[43], get_tooltip_slot_context$1);
    	const tooltip_slot_or_fallback = tooltip_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (tooltip_slot_or_fallback) tooltip_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (tooltip_slot_or_fallback) {
    				tooltip_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (tooltip_slot) {
    				if (tooltip_slot.p && (!current || dirty[0] & /*prefix, suffix, value*/ 24577 | dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						tooltip_slot,
    						tooltip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(tooltip_slot_template, /*$$scope*/ ctx[43], dirty, get_tooltip_slot_changes$1),
    						get_tooltip_slot_context$1
    					);
    				}
    			} else {
    				if (tooltip_slot_or_fallback && tooltip_slot_or_fallback.p && (!current || dirty[0] & /*suffix, value, prefix*/ 24577)) {
    					tooltip_slot_or_fallback.p(ctx, !current ? [-1, -1] : dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (tooltip_slot_or_fallback) tooltip_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(201:3) <TooltipSurface class=\\\"slider-tooltip\\\">",
    		ctx
    	});

    	return block;
    }

    // (210:2) {#if track}
    function create_if_block_1$6(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "slider-track svelte-1ikqxku");
    			add_location(div, file$g, 210, 3, 6833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[37](div);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[37](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$6.name,
    		type: "if",
    		source: "(210:2) {#if track}",
    		ctx
    	});

    	return block;
    }

    // (215:1) {#if ticks}
    function create_if_block$a(ctx) {
    	let div;
    	let div_class_value;
    	let each_value = /*ticks*/ ctx[10];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", div_class_value = "slider-tick-bar placement-" + /*tickPlacement*/ ctx[11] + " svelte-1ikqxku");
    			add_location(div, file$g, 215, 2, 6919);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}

    			/*div_binding_1*/ ctx[39](div);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*valueToPercentage, ticks*/ 33555456) {
    				each_value = /*ticks*/ ctx[10];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*tickPlacement*/ 2048 && div_class_value !== (div_class_value = "slider-tick-bar placement-" + /*tickPlacement*/ ctx[11] + " svelte-1ikqxku")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			/*div_binding_1*/ ctx[39](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(215:1) {#if ticks}",
    		ctx
    	});

    	return block;
    }

    // (217:3) {#each ticks as tick}
    function create_each_block$2(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "slider-tick svelte-1ikqxku");
    			set_style(div, "--fds-slider-tick-percentage", /*valueToPercentage*/ ctx[25](/*tick*/ ctx[46]) + "%");
    			add_location(div, file$g, 217, 4, 7031);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*ticks*/ 1024) {
    				set_style(div, "--fds-slider-tick-percentage", /*valueToPercentage*/ ctx[25](/*tick*/ ctx[46]) + "%");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(217:3) {#each ticks as tick}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div2;
    	let div0;
    	let div0_resize_listener;
    	let t0;
    	let div1;
    	let t1;
    	let t2;
    	let input;
    	let div2_tabindex_value;
    	let div2_style_value;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*tooltip*/ ctx[12] && !/*disabled*/ ctx[17] && create_if_block_2$3(ctx);
    	let if_block1 = /*track*/ ctx[15] && create_if_block_1$6(ctx);
    	let if_block2 = /*ticks*/ ctx[10] && create_if_block$a(ctx);

    	let div2_levels = [
    		{
    			tabindex: div2_tabindex_value = /*disabled*/ ctx[17] ? -1 : 0
    		},
    		{
    			style: div2_style_value = "--fds-slider-percentage: " + /*percentage*/ ctx[23] + "%; --fds-slider-thumb-offset: " + (/*thumbClientWidth*/ ctx[22] / 2 - linearScale([0, 50], [0, /*thumbClientWidth*/ ctx[22] / 2])(/*percentage*/ ctx[23])) + "px;"
    		},
    		{
    			class: div2_class_value = "slider orientation-" + /*orientation*/ ctx[16] + " " + /*className*/ ctx[18]
    		},
    		/*$$restProps*/ ctx[30]
    	];

    	let div_data_2 = {};

    	for (let i = 0; i < div2_levels.length; i += 1) {
    		div_data_2 = assign(div_data_2, div2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			input = element("input");
    			attr_dev(div0, "class", "slider-thumb svelte-1ikqxku");
    			attr_dev(div0, "role", "slider");
    			attr_dev(div0, "aria-valuemin", /*min*/ ctx[7]);
    			attr_dev(div0, "aria-valuemax", /*max*/ ctx[8]);
    			attr_dev(div0, "aria-valuenow", /*value*/ ctx[0]);
    			add_render_callback(() => /*div0_elementresize_handler*/ ctx[36].call(div0));
    			add_location(div0, file$g, 190, 1, 6382);
    			attr_dev(div1, "class", "slider-rail svelte-1ikqxku");
    			add_location(div1, file$g, 208, 1, 6766);
    			attr_dev(input, "type", "range");
    			input.hidden = true;
    			attr_dev(input, "min", /*min*/ ctx[7]);
    			attr_dev(input, "max", /*max*/ ctx[8]);
    			attr_dev(input, "step", /*step*/ ctx[9]);
    			input.disabled = /*disabled*/ ctx[17];
    			input.value = /*value*/ ctx[0];
    			add_location(input, file$g, 225, 1, 7167);
    			set_attributes(div2, div_data_2);
    			toggle_class(div2, "disabled", /*disabled*/ ctx[17]);
    			toggle_class(div2, "reverse", /*directionAwareReverse*/ ctx[21]);
    			toggle_class(div2, "svelte-1ikqxku", true);
    			add_location(div2, file$g, 172, 0, 5857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			if (if_block0) if_block0.m(div0, null);
    			/*div0_binding*/ ctx[35](div0);
    			div0_resize_listener = add_iframe_resize_listener(div0, /*div0_elementresize_handler*/ ctx[36].bind(div0));
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			/*div1_binding*/ ctx[38](div1);
    			append_dev(div2, t1);
    			if (if_block2) if_block2.m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, input);
    			/*input_binding*/ ctx[40](input);
    			/*div2_binding*/ ctx[42](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1$1, "mousemove", /*handleMove*/ ctx[27], false, false, false, false),
    					listen_dev(window_1$1, "touchmove", /*handleMove*/ ctx[27], false, false, false, false),
    					listen_dev(window_1$1, "mouseup", /*cancelMove*/ ctx[26], false, false, false, false),
    					listen_dev(window_1$1, "touchend", /*cancelMove*/ ctx[26], false, false, false, false),
    					listen_dev(window_1$1, "touchcancel", /*cancelMove*/ ctx[26], false, false, false, false),
    					action_destroyer(/*forwardEvents*/ ctx[24].call(null, div2)),
    					listen_dev(div2, "mousedown", prevent_default(/*mousedown_handler*/ ctx[41]), false, true, false, false),
    					listen_dev(div2, "touchstart", /*handleTouchStart*/ ctx[29], false, false, false, false),
    					listen_dev(div2, "keydown", /*handleArrowKeys*/ ctx[28], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*tooltip*/ ctx[12] && !/*disabled*/ ctx[17]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*tooltip, disabled*/ 135168) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*min*/ 128) {
    				attr_dev(div0, "aria-valuemin", /*min*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*max*/ 256) {
    				attr_dev(div0, "aria-valuemax", /*max*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*value*/ 1) {
    				attr_dev(div0, "aria-valuenow", /*value*/ ctx[0]);
    			}

    			if (/*track*/ ctx[15]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$6(ctx);
    					if_block1.c();
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*ticks*/ ctx[10]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$a(ctx);
    					if_block2.c();
    					if_block2.m(div2, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!current || dirty[0] & /*min*/ 128) {
    				attr_dev(input, "min", /*min*/ ctx[7]);
    			}

    			if (!current || dirty[0] & /*max*/ 256) {
    				attr_dev(input, "max", /*max*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*step*/ 512) {
    				attr_dev(input, "step", /*step*/ ctx[9]);
    			}

    			if (!current || dirty[0] & /*disabled*/ 131072) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[17]);
    			}

    			if (!current || dirty[0] & /*value*/ 1) {
    				prop_dev(input, "value", /*value*/ ctx[0]);
    			}

    			set_attributes(div2, div_data_2 = get_spread_update(div2_levels, [
    				(!current || dirty[0] & /*disabled*/ 131072 && div2_tabindex_value !== (div2_tabindex_value = /*disabled*/ ctx[17] ? -1 : 0)) && { tabindex: div2_tabindex_value },
    				(!current || dirty[0] & /*percentage, thumbClientWidth*/ 12582912 && div2_style_value !== (div2_style_value = "--fds-slider-percentage: " + /*percentage*/ ctx[23] + "%; --fds-slider-thumb-offset: " + (/*thumbClientWidth*/ ctx[22] / 2 - linearScale([0, 50], [0, /*thumbClientWidth*/ ctx[22] / 2])(/*percentage*/ ctx[23])) + "px;")) && { style: div2_style_value },
    				(!current || dirty[0] & /*orientation, className*/ 327680 && div2_class_value !== (div2_class_value = "slider orientation-" + /*orientation*/ ctx[16] + " " + /*className*/ ctx[18])) && { class: div2_class_value },
    				dirty[0] & /*$$restProps*/ 1073741824 && /*$$restProps*/ ctx[30]
    			]));

    			toggle_class(div2, "disabled", /*disabled*/ ctx[17]);
    			toggle_class(div2, "reverse", /*directionAwareReverse*/ ctx[21]);
    			toggle_class(div2, "svelte-1ikqxku", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			/*div0_binding*/ ctx[35](null);
    			div0_resize_listener();
    			if (if_block1) if_block1.d();
    			/*div1_binding*/ ctx[38](null);
    			if (if_block2) if_block2.d();
    			/*input_binding*/ ctx[40](null);
    			/*div2_binding*/ ctx[42](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function linearScale(input, output) {
    	return value => {
    		if (input[0] === input[1] || output[0] === output[1]) return output[0];
    		const ratio = (output[1] - output[0]) / (input[1] - input[0]);
    		return output[0] + ratio * (value - input[0]);
    	};
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let percentage;

    	const omit_props_names = [
    		"value","min","max","step","ticks","tickPlacement","tooltip","prefix","suffix","track","orientation","reverse","disabled","class","inputElement","containerElement","tickBarElement","thumbElement","railElement","trackElement","stepUp","stepDown"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, ['tooltip']);
    	let { value = 0 } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { step = 1 } = $$props;
    	let { ticks = [] } = $$props;
    	let { tickPlacement = "around" } = $$props;
    	let { tooltip = true } = $$props;
    	let { prefix = "" } = $$props;
    	let { suffix = "" } = $$props;
    	let { track = true } = $$props;
    	let { orientation = "horizontal" } = $$props;
    	let { reverse = false } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { inputElement = null } = $$props;
    	let { containerElement = null } = $$props;
    	let { tickBarElement = null } = $$props;
    	let { thumbElement = null } = $$props;
    	let { railElement = null } = $$props;
    	let { trackElement = null } = $$props;
    	let dragging = false;
    	let holding = false;
    	let directionAwareReverse = false;
    	let thumbClientWidth = 20;
    	const dispatch = createEventDispatcher();
    	const forwardEvents = createEventForwarder(get_current_component(), ["input", "change", "beforeinput"]);

    	// Divides the current value minus the minimum value
    	// by the difference between the max and min values,
    	// and multiplies by 100 to get a percentage.
    	const valueToPercentage = v => (v - min) / (max - min) * 100;

    	function cancelMove() {
    		$$invalidate(20, holding = false);
    		$$invalidate(19, dragging = false);
    	}

    	function handleMove() {
    		if (holding) $$invalidate(19, dragging = true);
    	}

    	function calculateValue(event) {
    		if (disabled || !railElement) return;
    		const { top, bottom, left, right, width, height } = railElement.getBoundingClientRect();
    		const percentageX = event.touches ? event.touches[0].clientX : event.clientX;
    		const percentageY = event.touches ? event.touches[0].clientY : event.clientY;
    		const position = orientation === "horizontal" ? percentageX : percentageY;

    		const startingPos = orientation === "horizontal"
    		? directionAwareReverse ? right : left
    		: directionAwareReverse ? top : bottom;

    		const length = orientation === "horizontal" ? width : height;
    		let nextStep = min + Math.round((max - min) * ((position - startingPos) / length) * (directionAwareReverse ? -1 : 1) * (orientation === "vertical" ? -1 : 1) / step) * step;
    		if (nextStep <= min) nextStep = min; else if (nextStep >= max) nextStep = max;
    		$$invalidate(0, value = nextStep);
    	}

    	function handleArrowKeys(event) {
    		const { key } = event;
    		if (key === "ArrowDown" || key === "ArrowUp") event.preventDefault();

    		if (key === "ArrowLeft" || key === "ArrowDown" && !disabled) {
    			if (reverse) {
    				stepUp();
    			} else {
    				stepDown();
    			}
    		} else if (key === "ArrowRight" || key === "ArrowUp" && !disabled) {
    			if (reverse) {
    				stepDown();
    			} else {
    				stepUp();
    			}
    		}
    	}

    	function handleTouchStart(event) {
    		if (event.cancelable) event.preventDefault();
    		$$invalidate(20, holding = true);
    	}

    	function stepUp() {
    		$$invalidate(0, value += step);
    		if (value > max) $$invalidate(0, value = max);
    	}

    	function stepDown() {
    		$$invalidate(0, value -= step);
    		if (value < min) $$invalidate(0, value = min);
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			thumbElement = $$value;
    			$$invalidate(4, thumbElement);
    		});
    	}

    	function div0_elementresize_handler() {
    		thumbClientWidth = this.clientWidth;
    		$$invalidate(22, thumbClientWidth);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			trackElement = $$value;
    			$$invalidate(6, trackElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			railElement = $$value;
    			$$invalidate(5, railElement);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			tickBarElement = $$value;
    			$$invalidate(3, tickBarElement);
    		});
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(2, inputElement);
    		});
    	}

    	const mousedown_handler = () => {
    		$$invalidate(20, holding = true);
    		$$invalidate(19, dragging = true);
    	};

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(1, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(30, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('min' in $$new_props) $$invalidate(7, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(8, max = $$new_props.max);
    		if ('step' in $$new_props) $$invalidate(9, step = $$new_props.step);
    		if ('ticks' in $$new_props) $$invalidate(10, ticks = $$new_props.ticks);
    		if ('tickPlacement' in $$new_props) $$invalidate(11, tickPlacement = $$new_props.tickPlacement);
    		if ('tooltip' in $$new_props) $$invalidate(12, tooltip = $$new_props.tooltip);
    		if ('prefix' in $$new_props) $$invalidate(13, prefix = $$new_props.prefix);
    		if ('suffix' in $$new_props) $$invalidate(14, suffix = $$new_props.suffix);
    		if ('track' in $$new_props) $$invalidate(15, track = $$new_props.track);
    		if ('orientation' in $$new_props) $$invalidate(16, orientation = $$new_props.orientation);
    		if ('reverse' in $$new_props) $$invalidate(31, reverse = $$new_props.reverse);
    		if ('disabled' in $$new_props) $$invalidate(17, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(18, className = $$new_props.class);
    		if ('inputElement' in $$new_props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$new_props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('tickBarElement' in $$new_props) $$invalidate(3, tickBarElement = $$new_props.tickBarElement);
    		if ('thumbElement' in $$new_props) $$invalidate(4, thumbElement = $$new_props.thumbElement);
    		if ('railElement' in $$new_props) $$invalidate(5, railElement = $$new_props.railElement);
    		if ('trackElement' in $$new_props) $$invalidate(6, trackElement = $$new_props.trackElement);
    		if ('$$scope' in $$new_props) $$invalidate(43, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventForwarder,
    		TooltipSurface,
    		createEventDispatcher,
    		get_current_component,
    		value,
    		min,
    		max,
    		step,
    		ticks,
    		tickPlacement,
    		tooltip,
    		prefix,
    		suffix,
    		track,
    		orientation,
    		reverse,
    		disabled,
    		className,
    		inputElement,
    		containerElement,
    		tickBarElement,
    		thumbElement,
    		railElement,
    		trackElement,
    		dragging,
    		holding,
    		directionAwareReverse,
    		thumbClientWidth,
    		dispatch,
    		forwardEvents,
    		valueToPercentage,
    		cancelMove,
    		handleMove,
    		calculateValue,
    		handleArrowKeys,
    		handleTouchStart,
    		linearScale,
    		stepUp,
    		stepDown,
    		percentage
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('min' in $$props) $$invalidate(7, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(8, max = $$new_props.max);
    		if ('step' in $$props) $$invalidate(9, step = $$new_props.step);
    		if ('ticks' in $$props) $$invalidate(10, ticks = $$new_props.ticks);
    		if ('tickPlacement' in $$props) $$invalidate(11, tickPlacement = $$new_props.tickPlacement);
    		if ('tooltip' in $$props) $$invalidate(12, tooltip = $$new_props.tooltip);
    		if ('prefix' in $$props) $$invalidate(13, prefix = $$new_props.prefix);
    		if ('suffix' in $$props) $$invalidate(14, suffix = $$new_props.suffix);
    		if ('track' in $$props) $$invalidate(15, track = $$new_props.track);
    		if ('orientation' in $$props) $$invalidate(16, orientation = $$new_props.orientation);
    		if ('reverse' in $$props) $$invalidate(31, reverse = $$new_props.reverse);
    		if ('disabled' in $$props) $$invalidate(17, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(18, className = $$new_props.className);
    		if ('inputElement' in $$props) $$invalidate(2, inputElement = $$new_props.inputElement);
    		if ('containerElement' in $$props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('tickBarElement' in $$props) $$invalidate(3, tickBarElement = $$new_props.tickBarElement);
    		if ('thumbElement' in $$props) $$invalidate(4, thumbElement = $$new_props.thumbElement);
    		if ('railElement' in $$props) $$invalidate(5, railElement = $$new_props.railElement);
    		if ('trackElement' in $$props) $$invalidate(6, trackElement = $$new_props.trackElement);
    		if ('dragging' in $$props) $$invalidate(19, dragging = $$new_props.dragging);
    		if ('holding' in $$props) $$invalidate(20, holding = $$new_props.holding);
    		if ('directionAwareReverse' in $$props) $$invalidate(21, directionAwareReverse = $$new_props.directionAwareReverse);
    		if ('thumbClientWidth' in $$props) $$invalidate(22, thumbClientWidth = $$new_props.thumbClientWidth);
    		if ('percentage' in $$props) $$invalidate(23, percentage = $$new_props.percentage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*containerElement*/ 2 | $$self.$$.dirty[1] & /*reverse*/ 1) {
    			if (containerElement) {
    				$$invalidate(21, directionAwareReverse = (window === null || window === void 0
    				? void 0
    				: window.getComputedStyle(containerElement).direction) === "ltr"
    				? reverse
    				: !reverse);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, min, max, dragging*/ 524673) {
    			{
    				if (value <= min) $$invalidate(0, value = min); else if (value >= max) $$invalidate(0, value = max);

    				if (dragging) {
    					calculateValue(event);
    					$$invalidate(19, dragging = false);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			dispatch("change", value);
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			$$invalidate(23, percentage = valueToPercentage(value));
    		}
    	};

    	return [
    		value,
    		containerElement,
    		inputElement,
    		tickBarElement,
    		thumbElement,
    		railElement,
    		trackElement,
    		min,
    		max,
    		step,
    		ticks,
    		tickPlacement,
    		tooltip,
    		prefix,
    		suffix,
    		track,
    		orientation,
    		disabled,
    		className,
    		dragging,
    		holding,
    		directionAwareReverse,
    		thumbClientWidth,
    		percentage,
    		forwardEvents,
    		valueToPercentage,
    		cancelMove,
    		handleMove,
    		handleArrowKeys,
    		handleTouchStart,
    		$$restProps,
    		reverse,
    		stepUp,
    		stepDown,
    		slots,
    		div0_binding,
    		div0_elementresize_handler,
    		div_binding,
    		div1_binding,
    		div_binding_1,
    		input_binding,
    		mousedown_handler,
    		div2_binding,
    		$$scope
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$g,
    			create_fragment$g,
    			safe_not_equal,
    			{
    				value: 0,
    				min: 7,
    				max: 8,
    				step: 9,
    				ticks: 10,
    				tickPlacement: 11,
    				tooltip: 12,
    				prefix: 13,
    				suffix: 14,
    				track: 15,
    				orientation: 16,
    				reverse: 31,
    				disabled: 17,
    				class: 18,
    				inputElement: 2,
    				containerElement: 1,
    				tickBarElement: 3,
    				thumbElement: 4,
    				railElement: 5,
    				trackElement: 6,
    				stepUp: 32,
    				stepDown: 33
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get value() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ticks() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ticks(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickPlacement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickPlacement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltip() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltip(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get suffix() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set suffix(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get track() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set track(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get reverse() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set reverse(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tickBarElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tickBarElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get railElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set railElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackElement() {
    		throw new Error("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackElement(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stepUp() {
    		return this.$$.ctx[32];
    	}

    	set stepUp(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stepDown() {
    		return this.$$.ctx[33];
    	}

    	set stepDown(value) {
    		throw new Error("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/PersonPicture/PersonPicture.svelte generated by Svelte v3.59.2 */

    const file$f = "node_modules/fluent-svelte/PersonPicture/PersonPicture.svelte";
    const get_badge_slot_changes = dirty => ({});
    const get_badge_slot_context = ctx => ({});

    // (35:1) {:else}
    function create_else_block$3(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	let div_levels = [
    		{
    			class: div_class_value = "person-picture " + /*className*/ ctx[5]
    		},
    		/*$$restProps*/ ctx[7]
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "svelte-p3ps28", true);
    			add_location(div, file$f, 35, 2, 1017);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div, null);
    			}

    			/*div_binding*/ ctx[13](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[9], dirty, null),
    						null
    					);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && (!current || dirty & /*alt*/ 16)) {
    					default_slot_or_fallback.p(ctx, !current ? -1 : dirty);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				(!current || dirty & /*className*/ 32 && div_class_value !== (div_class_value = "person-picture " + /*className*/ ctx[5])) && { class: div_class_value },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(div, "svelte-p3ps28", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    			/*div_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(35:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (24:1) {#if src && !error}
    function create_if_block_1$5(ctx) {
    	let img;
    	let img_class_value;
    	let img_src_value;
    	let mounted;
    	let dispose;

    	let img_levels = [
    		{
    			class: img_class_value = "person-picture " + /*className*/ ctx[5]
    		},
    		{ width: /*size*/ ctx[2] },
    		{ height: /*size*/ ctx[2] },
    		{ src: img_src_value = /*src*/ ctx[3] },
    		{ alt: /*alt*/ ctx[4] },
    		/*$$restProps*/ ctx[7]
    	];

    	let img_data = {};

    	for (let i = 0; i < img_levels.length; i += 1) {
    		img_data = assign(img_data, img_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			img = element("img");
    			set_attributes(img, img_data);
    			toggle_class(img, "svelte-p3ps28", true);
    			add_location(img, file$f, 24, 2, 829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			/*img_binding*/ ctx[11](img);

    			if (!mounted) {
    				dispose = listen_dev(img, "error", /*error_handler*/ ctx[12], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(img, img_data = get_spread_update(img_levels, [
    				dirty & /*className*/ 32 && img_class_value !== (img_class_value = "person-picture " + /*className*/ ctx[5]) && { class: img_class_value },
    				dirty & /*size*/ 4 && { width: /*size*/ ctx[2] },
    				dirty & /*size*/ 4 && { height: /*size*/ ctx[2] },
    				dirty & /*src*/ 8 && !src_url_equal(img.src, img_src_value = /*src*/ ctx[3]) && { src: img_src_value },
    				dirty & /*alt*/ 16 && { alt: /*alt*/ ctx[4] },
    				dirty & /*$$restProps*/ 128 && /*$$restProps*/ ctx[7]
    			]));

    			toggle_class(img, "svelte-p3ps28", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			/*img_binding*/ ctx[11](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(24:1) {#if src && !error}",
    		ctx
    	});

    	return block;
    }

    // (37:9)      
    function fallback_block(ctx) {
    	let t_value = (/*alt*/ ctx[4]?.split(" ").map(func).join("").toUpperCase() ?? "") + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*alt*/ 16 && t_value !== (t_value = (/*alt*/ ctx[4]?.split(" ").map(func).join("").toUpperCase() ?? "") + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(37:9)      ",
    		ctx
    	});

    	return block;
    }

    // (46:1) {#if $$slots.badge}
    function create_if_block$9(ctx) {
    	let span;
    	let current;
    	const badge_slot_template = /*#slots*/ ctx[10].badge;
    	const badge_slot = create_slot(badge_slot_template, ctx, /*$$scope*/ ctx[9], get_badge_slot_context);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (badge_slot) badge_slot.c();
    			attr_dev(span, "class", "person-picture-badge svelte-p3ps28");
    			add_location(span, file$f, 46, 2, 1252);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (badge_slot) {
    				badge_slot.m(span, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (badge_slot) {
    				if (badge_slot.p && (!current || dirty & /*$$scope*/ 512)) {
    					update_slot_base(
    						badge_slot,
    						badge_slot_template,
    						ctx,
    						/*$$scope*/ ctx[9],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[9])
    						: get_slot_changes(badge_slot_template, /*$$scope*/ ctx[9], dirty, get_badge_slot_changes),
    						get_badge_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(badge_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(badge_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (badge_slot) badge_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(46:1) {#if $$slots.badge}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block0;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$5, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*src*/ ctx[3] && !/*error*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*$$slots*/ ctx[8].badge && create_if_block$9(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t = space();
    			if (if_block1) if_block1.c();
    			attr_dev(div, "class", "person-picture-container svelte-p3ps28");
    			set_style(div, "--fds-person-picture-size", /*size*/ ctx[2] + "px");
    			add_location(div, file$f, 18, 0, 690);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding_1*/ ctx[14](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div, t);
    			}

    			if (/*$$slots*/ ctx[8].badge) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$9(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*size*/ 4) {
    				set_style(div, "--fds-person-picture-size", /*size*/ ctx[2] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			/*div_binding_1*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const func = i => i.charAt(0);

    function instance$f($$self, $$props, $$invalidate) {
    	const omit_props_names = ["size","src","alt","class","element","containerElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PersonPicture', slots, ['default','badge']);
    	const $$slots = compute_slots(slots);
    	let { size = 72 } = $$props;
    	let { src = undefined } = $$props;
    	let { alt = undefined } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { containerElement = null } = $$props;
    	let error = false;

    	function img_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	const error_handler = () => $$invalidate(6, error = true);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(1, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(7, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('src' in $$new_props) $$invalidate(3, src = $$new_props.src);
    		if ('alt' in $$new_props) $$invalidate(4, alt = $$new_props.alt);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('containerElement' in $$new_props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('$$scope' in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		size,
    		src,
    		alt,
    		className,
    		element,
    		containerElement,
    		error
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('src' in $$props) $$invalidate(3, src = $$new_props.src);
    		if ('alt' in $$props) $$invalidate(4, alt = $$new_props.alt);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('containerElement' in $$props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('error' in $$props) $$invalidate(6, error = $$new_props.error);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*src*/ 8) {
    			if (src) $$invalidate(6, error = false);
    		}
    	};

    	return [
    		element,
    		containerElement,
    		size,
    		src,
    		alt,
    		className,
    		error,
    		$$restProps,
    		$$slots,
    		$$scope,
    		slots,
    		img_binding,
    		error_handler,
    		div_binding,
    		div_binding_1
    	];
    }

    class PersonPicture extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			size: 2,
    			src: 3,
    			alt: 4,
    			class: 5,
    			element: 0,
    			containerElement: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PersonPicture",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get size() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get src() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set src(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<PersonPicture>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<PersonPicture>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Tooltip/TooltipWrapper.svelte generated by Svelte v3.59.2 */
    const file$e = "node_modules/fluent-svelte/Tooltip/TooltipWrapper.svelte";
    const get_tooltip_slot_changes = dirty => ({});
    const get_tooltip_slot_context = ctx => ({});

    // (77:1) {#if visible}
    function create_if_block$8(ctx) {
    	let div;
    	let tooltipsurface;
    	let updating_element;
    	let div_class_value;
    	let div_style_value;
    	let div_intro;
    	let current;
    	const tooltipsurface_spread_levels = [/*$$restProps*/ ctx[15]];

    	function tooltipsurface_element_binding(value) {
    		/*tooltipsurface_element_binding*/ ctx[19](value);
    	}

    	let tooltipsurface_props = {
    		$$slots: { default: [create_default_slot$8] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < tooltipsurface_spread_levels.length; i += 1) {
    		tooltipsurface_props = assign(tooltipsurface_props, tooltipsurface_spread_levels[i]);
    	}

    	if (/*tooltipElement*/ ctx[1] !== void 0) {
    		tooltipsurface_props.element = /*tooltipElement*/ ctx[1];
    	}

    	tooltipsurface = new TooltipSurface({
    			props: tooltipsurface_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(tooltipsurface, 'element', tooltipsurface_element_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(tooltipsurface.$$.fragment);
    			attr_dev(div, "class", div_class_value = "tooltip-anchor placement-" + /*placement*/ ctx[6] + " alignment-" + /*alignment*/ ctx[7] + " svelte-e2a5n0");

    			attr_dev(div, "style", div_style_value = "" + ((/*placement*/ ctx[6] === 'auto'
    			? `top: calc(${/*currentPosition*/ ctx[10].y}px - var(--fds-tooltip-offset));
				   left: ${/*currentPosition*/ ctx[10].x}px;`
    			: '') + " --fds-tooltip-offset: " + /*offset*/ ctx[5] + "px"));

    			add_location(div, file$e, 77, 2, 2574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(tooltipsurface, div, null);
    			/*div_binding*/ ctx[20](div);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const tooltipsurface_changes = (dirty & /*$$restProps*/ 32768)
    			? get_spread_update(tooltipsurface_spread_levels, [get_spread_object(/*$$restProps*/ ctx[15])])
    			: {};

    			if (dirty & /*$$scope, text*/ 8388624) {
    				tooltipsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*tooltipElement*/ 2) {
    				updating_element = true;
    				tooltipsurface_changes.element = /*tooltipElement*/ ctx[1];
    				add_flush_callback(() => updating_element = false);
    			}

    			tooltipsurface.$set(tooltipsurface_changes);

    			if (!current || dirty & /*placement, alignment*/ 192 && div_class_value !== (div_class_value = "tooltip-anchor placement-" + /*placement*/ ctx[6] + " alignment-" + /*alignment*/ ctx[7] + " svelte-e2a5n0")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*placement, currentPosition, offset*/ 1120 && div_style_value !== (div_style_value = "" + ((/*placement*/ ctx[6] === 'auto'
    			? `top: calc(${/*currentPosition*/ ctx[10].y}px - var(--fds-tooltip-offset));
				   left: ${/*currentPosition*/ ctx[10].x}px;`
    			: '') + " --fds-tooltip-offset: " + /*offset*/ ctx[5] + "px"))) {
    				attr_dev(div, "style", div_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltipsurface.$$.fragment, local);

    			if (local) {
    				if (!div_intro) {
    					add_render_callback(() => {
    						div_intro = create_in_transition(div, fade, {
    							duration: getCSSDuration("--fds-control-fast-duration")
    						});

    						div_intro.start();
    					});
    				}
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltipsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(tooltipsurface);
    			/*div_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(77:1) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (87:3) <TooltipSurface bind:element={tooltipElement} {...$$restProps}>
    function create_default_slot$8(ctx) {
    	let t0;
    	let t1;
    	let current;
    	const tooltip_slot_template = /*#slots*/ ctx[18].tooltip;
    	const tooltip_slot = create_slot(tooltip_slot_template, ctx, /*$$scope*/ ctx[23], get_tooltip_slot_context);

    	const block = {
    		c: function create() {
    			t0 = text(/*text*/ ctx[4]);
    			t1 = space();
    			if (tooltip_slot) tooltip_slot.c();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);

    			if (tooltip_slot) {
    				tooltip_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*text*/ 16) set_data_dev(t0, /*text*/ ctx[4]);

    			if (tooltip_slot) {
    				if (tooltip_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						tooltip_slot,
    						tooltip_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(tooltip_slot_template, /*$$scope*/ ctx[23], dirty, get_tooltip_slot_changes),
    						get_tooltip_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tooltip_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tooltip_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (tooltip_slot) tooltip_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(87:3) <TooltipSurface bind:element={tooltipElement} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let div;
    	let t;
    	let div_title_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);
    	let if_block = /*visible*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "tooltip-wrapper svelte-e2a5n0");
    			attr_dev(div, "title", div_title_value = /*mounted*/ ctx[9] ? undefined : /*text*/ ctx[4]);
    			add_location(div, file$e, 62, 0, 2218);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding_1*/ ctx[21](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "scroll", /*destroyTooltip*/ ctx[14], false, false, false, false),
    					listen_dev(div, "mouseenter", /*mountTooltip*/ ctx[13], false, false, false, false),
    					listen_dev(div, "mouseleave", /*destroyTooltip*/ ctx[14], false, false, false, false),
    					listen_dev(div, "mousemove", /*updateMousePosition*/ ctx[11], false, false, false, false),
    					listen_dev(div, "mousemove", /*mousemove_handler*/ ctx[22], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*visible*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*mounted, text*/ 528 && div_title_value !== (div_title_value = /*mounted*/ ctx[9] ? undefined : /*text*/ ctx[4])) {
    				attr_dev(div, "title", div_title_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding_1*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"text","offset","placement","alignment","followCursor","persistent","visible","delay","tooltipElement","anchorElement","wrapperElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TooltipWrapper', slots, ['default','tooltip']);
    	let { text = "" } = $$props;
    	let { offset = 24 } = $$props;
    	let { placement = "auto" } = $$props;
    	let { alignment = "center" } = $$props;
    	let { followCursor = false } = $$props;
    	let { persistent = false } = $$props;
    	let { visible = false } = $$props;
    	let { delay = 1000 } = $$props;
    	let { tooltipElement = null } = $$props;
    	let { anchorElement = null } = $$props;
    	let { wrapperElement = null } = $$props;
    	let mounted = false;
    	let tooltipDurationTimeout;
    	let currentPosition = { x: 0, y: 0 };
    	let mousePosition = { x: 0, y: 0 };
    	onMount(() => $$invalidate(9, mounted = true));

    	function updateMousePosition({ clientX, clientY }) {
    		mousePosition.x = clientX;
    		mousePosition.y = clientY;
    	}

    	function updateTooltipPositionAuto(wrapperPosition) {
    		const { left, top } = wrapperPosition;
    		$$invalidate(10, currentPosition.x = mousePosition.x - left, currentPosition);
    		$$invalidate(10, currentPosition.y = mousePosition.y - top, currentPosition);
    	}

    	function mountTooltip() {
    		tooltipDurationTimeout = setTimeout(
    			() => {
    				if (placement === "auto" && wrapperElement) updateTooltipPositionAuto(wrapperElement.getBoundingClientRect());
    				$$invalidate(0, visible = true);
    			},
    			delay
    		);
    	}

    	function destroyTooltip() {
    		clearTimeout(tooltipDurationTimeout);
    		if (!persistent) $$invalidate(0, visible = false);
    	}

    	function tooltipsurface_element_binding(value) {
    		tooltipElement = value;
    		$$invalidate(1, tooltipElement);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			anchorElement = $$value;
    			$$invalidate(2, anchorElement);
    		});
    	}

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapperElement = $$value;
    			$$invalidate(3, wrapperElement);
    		});
    	}

    	const mousemove_handler = () => placement === "auto" && followCursor && updateTooltipPositionAuto(wrapperElement.getBoundingClientRect());

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('text' in $$new_props) $$invalidate(4, text = $$new_props.text);
    		if ('offset' in $$new_props) $$invalidate(5, offset = $$new_props.offset);
    		if ('placement' in $$new_props) $$invalidate(6, placement = $$new_props.placement);
    		if ('alignment' in $$new_props) $$invalidate(7, alignment = $$new_props.alignment);
    		if ('followCursor' in $$new_props) $$invalidate(8, followCursor = $$new_props.followCursor);
    		if ('persistent' in $$new_props) $$invalidate(16, persistent = $$new_props.persistent);
    		if ('visible' in $$new_props) $$invalidate(0, visible = $$new_props.visible);
    		if ('delay' in $$new_props) $$invalidate(17, delay = $$new_props.delay);
    		if ('tooltipElement' in $$new_props) $$invalidate(1, tooltipElement = $$new_props.tooltipElement);
    		if ('anchorElement' in $$new_props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('wrapperElement' in $$new_props) $$invalidate(3, wrapperElement = $$new_props.wrapperElement);
    		if ('$$scope' in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		fade,
    		getCSSDuration,
    		TooltipSurface,
    		text,
    		offset,
    		placement,
    		alignment,
    		followCursor,
    		persistent,
    		visible,
    		delay,
    		tooltipElement,
    		anchorElement,
    		wrapperElement,
    		mounted,
    		tooltipDurationTimeout,
    		currentPosition,
    		mousePosition,
    		updateMousePosition,
    		updateTooltipPositionAuto,
    		mountTooltip,
    		destroyTooltip
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('text' in $$props) $$invalidate(4, text = $$new_props.text);
    		if ('offset' in $$props) $$invalidate(5, offset = $$new_props.offset);
    		if ('placement' in $$props) $$invalidate(6, placement = $$new_props.placement);
    		if ('alignment' in $$props) $$invalidate(7, alignment = $$new_props.alignment);
    		if ('followCursor' in $$props) $$invalidate(8, followCursor = $$new_props.followCursor);
    		if ('persistent' in $$props) $$invalidate(16, persistent = $$new_props.persistent);
    		if ('visible' in $$props) $$invalidate(0, visible = $$new_props.visible);
    		if ('delay' in $$props) $$invalidate(17, delay = $$new_props.delay);
    		if ('tooltipElement' in $$props) $$invalidate(1, tooltipElement = $$new_props.tooltipElement);
    		if ('anchorElement' in $$props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('wrapperElement' in $$props) $$invalidate(3, wrapperElement = $$new_props.wrapperElement);
    		if ('mounted' in $$props) $$invalidate(9, mounted = $$new_props.mounted);
    		if ('tooltipDurationTimeout' in $$props) tooltipDurationTimeout = $$new_props.tooltipDurationTimeout;
    		if ('currentPosition' in $$props) $$invalidate(10, currentPosition = $$new_props.currentPosition);
    		if ('mousePosition' in $$props) mousePosition = $$new_props.mousePosition;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		visible,
    		tooltipElement,
    		anchorElement,
    		wrapperElement,
    		text,
    		offset,
    		placement,
    		alignment,
    		followCursor,
    		mounted,
    		currentPosition,
    		updateMousePosition,
    		updateTooltipPositionAuto,
    		mountTooltip,
    		destroyTooltip,
    		$$restProps,
    		persistent,
    		delay,
    		slots,
    		tooltipsurface_element_binding,
    		div_binding,
    		div_binding_1,
    		mousemove_handler,
    		$$scope
    	];
    }

    class TooltipWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			text: 4,
    			offset: 5,
    			placement: 6,
    			alignment: 7,
    			followCursor: 8,
    			persistent: 16,
    			visible: 0,
    			delay: 17,
    			tooltipElement: 1,
    			anchorElement: 2,
    			wrapperElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TooltipWrapper",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get text() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get followCursor() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set followCursor(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get persistent() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set persistent(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get delay() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set delay(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tooltipElement() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tooltipElement(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorElement() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorElement(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapperElement() {
    		throw new Error("<TooltipWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapperElement(value) {
    		throw new Error("<TooltipWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ContentDialog/ContentDialog.svelte generated by Svelte v3.59.2 */
    const file$d = "node_modules/fluent-svelte/ContentDialog/ContentDialog.svelte";
    const get_outer_slot_changes = dirty => ({});
    const get_outer_slot_context = ctx => ({});
    const get_footer_slot_changes$1 = dirty => ({});
    const get_footer_slot_context$1 = ctx => ({});

    // (61:0) {#if open}
    function create_if_block$7(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let t1;
    	let div1_class_value;
    	let div1_aria_labelledby_value;
    	let div1_transition;
    	let t2;
    	let div2_transition;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*title*/ ctx[5] && create_if_block_2$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[21].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[28], null);
    	let if_block1 = /*$$slots*/ ctx[17].footer && create_if_block_1$4(ctx);

    	let div1_levels = [
    		{
    			class: div1_class_value = "content-dialog size-" + /*size*/ ctx[6] + " " + /*className*/ ctx[8]
    		},
    		{ role: "dialog" },
    		{ "aria-modal": "true" },
    		{
    			"aria-labelledby": div1_aria_labelledby_value = /*title*/ ctx[5] && /*titleId*/ ctx[12]
    		},
    		{ "aria-describedby": /*bodyId*/ ctx[13] },
    		/*$$restProps*/ ctx[16]
    	];

    	let div_data_1 = {};

    	for (let i = 0; i < div1_levels.length; i += 1) {
    		div_data_1 = assign(div_data_1, div1_levels[i]);
    	}

    	const outer_slot_template = /*#slots*/ ctx[21].outer;
    	const outer_slot = create_slot(outer_slot_template, ctx, /*$$scope*/ ctx[28], get_outer_slot_context);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			if (outer_slot) outer_slot.c();
    			attr_dev(div0, "class", "content-dialog-body svelte-1szmc6y");
    			attr_dev(div0, "id", /*bodyId*/ ctx[13]);
    			add_location(div0, file$d, 86, 3, 2930);
    			set_attributes(div1, div_data_1);
    			toggle_class(div1, "svelte-1szmc6y", true);
    			add_location(div1, file$d, 71, 2, 2566);
    			attr_dev(div2, "class", "content-dialog-smoke svelte-1szmc6y");
    			toggle_class(div2, "darken", /*darken*/ ctx[7]);
    			add_location(div2, file$d, 61, 1, 2245);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[22](div0);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			/*div1_binding*/ ctx[24](div1);
    			append_dev(div2, t2);

    			if (outer_slot) {
    				outer_slot.m(div2, null);
    			}

    			/*div2_binding*/ ctx[27](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[10].call(null, div1)),
    					listen_dev(div2, "click", self(/*click_handler*/ ctx[25]), false, false, false, false),
    					listen_dev(div2, "mousedown", self(/*mousedown_handler*/ ctx[26]), false, false, false, false),
    					action_destroyer(/*mountDialog*/ ctx[14].call(null, div2)),
    					action_destroyer(/*_focusTrap*/ ctx[9].call(null, div2))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*title*/ ctx[5]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*title*/ 32) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[28],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[28])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[28], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*$$slots*/ ctx[17].footer) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 131072) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(div1, div_data_1 = get_spread_update(div1_levels, [
    				(!current || dirty & /*size, className*/ 320 && div1_class_value !== (div1_class_value = "content-dialog size-" + /*size*/ ctx[6] + " " + /*className*/ ctx[8])) && { class: div1_class_value },
    				{ role: "dialog" },
    				{ "aria-modal": "true" },
    				(!current || dirty & /*title*/ 32 && div1_aria_labelledby_value !== (div1_aria_labelledby_value = /*title*/ ctx[5] && /*titleId*/ ctx[12])) && {
    					"aria-labelledby": div1_aria_labelledby_value
    				},
    				{ "aria-describedby": /*bodyId*/ ctx[13] },
    				dirty & /*$$restProps*/ 65536 && /*$$restProps*/ ctx[16]
    			]));

    			toggle_class(div1, "svelte-1szmc6y", true);

    			if (outer_slot) {
    				if (outer_slot.p && (!current || dirty & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						outer_slot,
    						outer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[28],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[28])
    						: get_slot_changes(outer_slot_template, /*$$scope*/ ctx[28], dirty, get_outer_slot_changes),
    						get_outer_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*darken*/ 128) {
    				toggle_class(div2, "darken", /*darken*/ ctx[7]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(if_block1);

    			if (local) {
    				add_render_callback(() => {
    					if (!current) return;

    					if (!div1_transition) div1_transition = create_bidirectional_transition(
    						div1,
    						scale,
    						{
    							duration: getCSSDuration("--fds-control-fast-duration"),
    							start: 1.05,
    							easing: circOut
    						},
    						true
    					);

    					div1_transition.run(1);
    				});
    			}

    			transition_in(outer_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!current) return;

    					if (!div2_transition) div2_transition = create_bidirectional_transition(
    						div2,
    						fade,
    						{
    							duration: getCSSDuration("--fds-control-faster-duration")
    						},
    						true
    					);

    					div2_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(if_block1);

    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(
    					div1,
    					scale,
    					{
    						duration: getCSSDuration("--fds-control-fast-duration"),
    						start: 1.05,
    						easing: circOut
    					},
    					false
    				);

    				div1_transition.run(0);
    			}

    			transition_out(outer_slot, local);

    			if (local) {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(
    					div2,
    					fade,
    					{
    						duration: getCSSDuration("--fds-control-faster-duration")
    					},
    					false
    				);

    				div2_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[22](null);
    			if (if_block1) if_block1.d();
    			/*div1_binding*/ ctx[24](null);
    			if (detaching && div1_transition) div1_transition.end();
    			if (outer_slot) outer_slot.d(detaching);
    			/*div2_binding*/ ctx[27](null);
    			if (detaching && div2_transition) div2_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(61:0) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (88:4) {#if title}
    function create_if_block_2$2(ctx) {
    	let textblock;
    	let current;

    	textblock = new TextBlock({
    			props: {
    				variant: "subtitle",
    				class: "content-dialog-title",
    				id: /*titleId*/ ctx[12],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textblock.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textblock, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textblock_changes = {};

    			if (dirty & /*$$scope, title*/ 268435488) {
    				textblock_changes.$$scope = { dirty, ctx };
    			}

    			textblock.$set(textblock_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textblock, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(88:4) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (89:5) <TextBlock variant="subtitle" class="content-dialog-title" id={titleId}>
    function create_default_slot$7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*title*/ ctx[5]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 32) set_data_dev(t, /*title*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(89:5) <TextBlock variant=\\\"subtitle\\\" class=\\\"content-dialog-title\\\" id={titleId}>",
    		ctx
    	});

    	return block;
    }

    // (95:3) {#if $$slots.footer}
    function create_if_block_1$4(ctx) {
    	let footer;
    	let current;
    	const footer_slot_template = /*#slots*/ ctx[21].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[28], get_footer_slot_context$1);

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			attr_dev(footer, "class", "content-dialog-footer svelte-1szmc6y");
    			add_location(footer, file$d, 95, 4, 3187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			/*footer_binding*/ ctx[23](footer);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 268435456)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[28],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[28])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[28], dirty, get_footer_slot_changes$1),
    						get_footer_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footer_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footer_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			if (footer_slot) footer_slot.d(detaching);
    			/*footer_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(95:3) {#if $$slots.footer}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*open*/ ctx[0] && create_if_block$7(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*handleEscapeKey*/ ctx[15], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let _focusTrap;

    	const omit_props_names = [
    		"open","title","size","closable","append","darken","trapFocus","class","element","backdropElement","bodyElement","footerElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContentDialog', slots, ['default','footer','outer']);
    	const $$slots = compute_slots(slots);
    	let { open = false } = $$props;
    	let { title = "" } = $$props;
    	let { size = "standard" } = $$props;
    	let { closable = true } = $$props;
    	let { append = undefined } = $$props;
    	let { darken = true } = $$props;
    	let { trapFocus = true } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { backdropElement = null } = $$props;
    	let { bodyElement = null } = $$props;
    	let { footerElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component(), ["open", "close", "backdropclick", "backdropmousedown"]);
    	const dispatch = createEventDispatcher();
    	const titleId = uid("fds-dialog-title-");
    	const bodyId = uid("fds-dialog-body-");

    	function mountDialog(node) {
    		dispatch("open");
    		if (append) append.appendChild(node);
    		node.focus();
    	}

    	function close() {
    		$$invalidate(0, open = false);
    	}

    	function handleEscapeKey({ key }) {
    		if (key === "Escape" && open && closable) close();
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			bodyElement = $$value;
    			$$invalidate(3, bodyElement);
    		});
    	}

    	function footer_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			footerElement = $$value;
    			$$invalidate(4, footerElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	const click_handler = e => dispatch("backdropclick", e);
    	const mousedown_handler = e => dispatch("backdropmousedown", e);

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			backdropElement = $$value;
    			$$invalidate(2, backdropElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(16, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('title' in $$new_props) $$invalidate(5, title = $$new_props.title);
    		if ('size' in $$new_props) $$invalidate(6, size = $$new_props.size);
    		if ('closable' in $$new_props) $$invalidate(18, closable = $$new_props.closable);
    		if ('append' in $$new_props) $$invalidate(19, append = $$new_props.append);
    		if ('darken' in $$new_props) $$invalidate(7, darken = $$new_props.darken);
    		if ('trapFocus' in $$new_props) $$invalidate(20, trapFocus = $$new_props.trapFocus);
    		if ('class' in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(1, element = $$new_props.element);
    		if ('backdropElement' in $$new_props) $$invalidate(2, backdropElement = $$new_props.backdropElement);
    		if ('bodyElement' in $$new_props) $$invalidate(3, bodyElement = $$new_props.bodyElement);
    		if ('footerElement' in $$new_props) $$invalidate(4, footerElement = $$new_props.footerElement);
    		if ('$$scope' in $$new_props) $$invalidate(28, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		get_current_component,
    		fade,
    		scale,
    		circOut,
    		uid,
    		focusTrap,
    		getCSSDuration,
    		createEventForwarder,
    		TextBlock,
    		open,
    		title,
    		size,
    		closable,
    		append,
    		darken,
    		trapFocus,
    		className,
    		element,
    		backdropElement,
    		bodyElement,
    		footerElement,
    		forwardEvents,
    		dispatch,
    		titleId,
    		bodyId,
    		mountDialog,
    		close,
    		handleEscapeKey,
    		_focusTrap
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('title' in $$props) $$invalidate(5, title = $$new_props.title);
    		if ('size' in $$props) $$invalidate(6, size = $$new_props.size);
    		if ('closable' in $$props) $$invalidate(18, closable = $$new_props.closable);
    		if ('append' in $$props) $$invalidate(19, append = $$new_props.append);
    		if ('darken' in $$props) $$invalidate(7, darken = $$new_props.darken);
    		if ('trapFocus' in $$props) $$invalidate(20, trapFocus = $$new_props.trapFocus);
    		if ('className' in $$props) $$invalidate(8, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    		if ('backdropElement' in $$props) $$invalidate(2, backdropElement = $$new_props.backdropElement);
    		if ('bodyElement' in $$props) $$invalidate(3, bodyElement = $$new_props.bodyElement);
    		if ('footerElement' in $$props) $$invalidate(4, footerElement = $$new_props.footerElement);
    		if ('_focusTrap' in $$props) $$invalidate(9, _focusTrap = $$new_props._focusTrap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			if (!open) dispatch("close");
    		}

    		if ($$self.$$.dirty & /*trapFocus*/ 1048576) {
    			$$invalidate(9, _focusTrap = trapFocus
    			? focusTrap
    			: () => {
    					
    				});
    		}
    	};

    	return [
    		open,
    		element,
    		backdropElement,
    		bodyElement,
    		footerElement,
    		title,
    		size,
    		darken,
    		className,
    		_focusTrap,
    		forwardEvents,
    		dispatch,
    		titleId,
    		bodyId,
    		mountDialog,
    		handleEscapeKey,
    		$$restProps,
    		$$slots,
    		closable,
    		append,
    		trapFocus,
    		slots,
    		div0_binding,
    		footer_binding,
    		div1_binding,
    		click_handler,
    		mousedown_handler,
    		div2_binding,
    		$$scope
    	];
    }

    class ContentDialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			open: 0,
    			title: 5,
    			size: 6,
    			closable: 18,
    			append: 19,
    			darken: 7,
    			trapFocus: 20,
    			class: 8,
    			element: 1,
    			backdropElement: 2,
    			bodyElement: 3,
    			footerElement: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContentDialog",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get open() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get append() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set append(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get darken() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set darken(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trapFocus() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trapFocus(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropElement() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropElement(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bodyElement() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bodyElement(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get footerElement() {
    		throw new Error("<ContentDialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set footerElement(value) {
    		throw new Error("<ContentDialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/Expander/Expander.svelte generated by Svelte v3.59.2 */
    const file$c = "node_modules/fluent-svelte/Expander/Expander.svelte";
    const get_content_slot_changes = dirty => ({});
    const get_content_slot_context = ctx => ({});
    const get_icon_slot_changes$1 = dirty => ({});
    const get_icon_slot_context$1 = ctx => ({});

    // (72:3) {#if $$slots.icon}
    function create_if_block_1$3(ctx) {
    	let div;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[14].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[13], get_icon_slot_context$1);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot) icon_slot.c();
    			attr_dev(div, "class", "expander-icon svelte-1p16tfx");
    			add_location(div, file$c, 72, 4, 2314);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot) {
    				icon_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[13], dirty, get_icon_slot_changes$1),
    						get_icon_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(72:3) {#if $$slots.icon}",
    		ctx
    	});

    	return block;
    }

    // (92:5) {:else}
    function create_else_block$2(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M2.14645 7.35355C2.34171 7.54882 2.65829 7.54882 2.85355 7.35355L6 4.20711L9.14645 7.35355C9.34171 7.54882 9.65829 7.54882 9.85355 7.35355C10.0488 7.15829 10.0488 6.84171 9.85355 6.64645L6.35355 3.14645C6.15829 2.95118 5.84171 2.95118 5.64645 3.14645L2.14645 6.64645C1.95118 6.84171 1.95118 7.15829 2.14645 7.35355Z");
    			add_location(path, file$c, 92, 6, 3079);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(92:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (87:5) {#if direction === "down"}
    function create_if_block$6(ctx) {
    	let path;

    	const block = {
    		c: function create() {
    			path = svg_element("path");
    			attr_dev(path, "fill", "currentColor");
    			attr_dev(path, "d", "M2.14645 4.64645C2.34171 4.45118 2.65829 4.45118 2.85355 4.64645L6 7.79289L9.14645 4.64645C9.34171 4.45118 9.65829 4.45118 9.85355 4.64645C10.0488 4.84171 10.0488 5.15829 9.85355 5.35355L6.35355 8.85355C6.15829 9.04882 5.84171 9.04882 5.64645 8.85355L2.14645 5.35355C1.95118 5.15829 1.95118 4.84171 2.14645 4.64645Z");
    			add_location(path, file$c, 87, 6, 2691);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, path, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(path);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(87:5) {#if direction === \\\"down\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div3;
    	let h;
    	let div0;
    	let t0;
    	let span;
    	let t1;
    	let button;
    	let svg;
    	let t2;
    	let div2;
    	let div1;
    	let div3_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*$$slots*/ ctx[11].icon && create_if_block_1$3(ctx);
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	function select_block_type(ctx, dirty) {
    		if (/*direction*/ ctx[4] === "down") return create_if_block$6;
    		return create_else_block$2;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block1 = current_block_type(ctx);
    	const content_slot_template = /*#slots*/ ctx[14].content;
    	const content_slot = create_slot(content_slot_template, ctx, /*$$scope*/ ctx[13], get_content_slot_context);

    	let div3_levels = [
    		{
    			class: div3_class_value = "expander direction-" + /*direction*/ ctx[4] + " " + /*className*/ ctx[5]
    		},
    		{ role: "region" },
    		/*$$restProps*/ ctx[10]
    	];

    	let div_data_3 = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div_data_3 = assign(div_data_3, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h = element("h");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			span = element("span");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			button = element("button");
    			svg = svg_element("svg");
    			if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if (content_slot) content_slot.c();
    			attr_dev(span, "class", "expander-header-title svelte-1p16tfx");
    			add_location(span, file$c, 76, 3, 2391);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			attr_dev(svg, "class", "svelte-1p16tfx");
    			add_location(svg, file$c, 85, 4, 2569);
    			attr_dev(button, "class", "expander-chevron svelte-1p16tfx");
    			attr_dev(button, "tabindex", "-1");
    			attr_dev(button, "id", /*contentId*/ ctx[8]);
    			attr_dev(button, "aria-labelledby", /*headerId*/ ctx[7]);
    			add_location(button, file$c, 79, 3, 2455);
    			attr_dev(div0, "role", "button");
    			attr_dev(div0, "id", /*headerId*/ ctx[7]);
    			attr_dev(div0, "aria-controls", /*contentId*/ ctx[8]);
    			attr_dev(div0, "class", "expander-header svelte-1p16tfx");
    			attr_dev(div0, "aria-expanded", /*expanded*/ ctx[0]);
    			attr_dev(div0, "tabindex", "0");
    			add_location(div0, file$c, 60, 2, 2043);
    			add_location(h, file$c, 59, 1, 2015);
    			attr_dev(div1, "class", "expander-content svelte-1p16tfx");
    			add_location(div1, file$c, 102, 2, 3552);
    			attr_dev(div2, "class", "expander-content-anchor svelte-1p16tfx");
    			add_location(div2, file$c, 101, 1, 3512);
    			set_attributes(div3, div_data_3);
    			toggle_class(div3, "expanded", /*expanded*/ ctx[0]);
    			toggle_class(div3, "svelte-1p16tfx", true);
    			add_location(div3, file$c, 51, 0, 1857);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h);
    			append_dev(h, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, span);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append_dev(div0, t1);
    			append_dev(div0, button);
    			append_dev(button, svg);
    			if_block1.m(svg, null);
    			/*div0_binding*/ ctx[15](div0);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div1);

    			if (content_slot) {
    				content_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[17](div1);
    			/*div3_binding*/ ctx[18](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "keydown", /*handleKeydown*/ ctx[9], false, false, false, false),
    					listen_dev(div0, "click", /*click_handler*/ ctx[16], false, false, false, false),
    					action_destroyer(/*forwardEvents*/ ctx[6].call(null, div3))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$$slots*/ ctx[11].icon) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*$$slots*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(svg, null);
    				}
    			}

    			if (!current || dirty & /*expanded*/ 1) {
    				attr_dev(div0, "aria-expanded", /*expanded*/ ctx[0]);
    			}

    			if (content_slot) {
    				if (content_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						content_slot,
    						content_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(content_slot_template, /*$$scope*/ ctx[13], dirty, get_content_slot_changes),
    						get_content_slot_context
    					);
    				}
    			}

    			set_attributes(div3, div_data_3 = get_spread_update(div3_levels, [
    				(!current || dirty & /*direction, className*/ 48 && div3_class_value !== (div3_class_value = "expander direction-" + /*direction*/ ctx[4] + " " + /*className*/ ctx[5])) && { class: div3_class_value },
    				{ role: "region" },
    				dirty & /*$$restProps*/ 1024 && /*$$restProps*/ ctx[10]
    			]));

    			toggle_class(div3, "expanded", /*expanded*/ ctx[0]);
    			toggle_class(div3, "svelte-1p16tfx", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(default_slot, local);
    			transition_in(content_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(default_slot, local);
    			transition_out(content_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if_block1.d();
    			/*div0_binding*/ ctx[15](null);
    			if (content_slot) content_slot.d(detaching);
    			/*div1_binding*/ ctx[17](null);
    			/*div3_binding*/ ctx[18](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"expanded","direction","headingLevel","class","containerElement","headerElement","contentElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Expander', slots, ['icon','default','content']);
    	const $$slots = compute_slots(slots);
    	let { expanded = false } = $$props;
    	let { direction = "down" } = $$props;
    	let { headingLevel = 3 } = $$props;
    	let { class: className = "" } = $$props;
    	let { containerElement = null } = $$props;
    	let { headerElement = null } = $$props;
    	let { contentElement = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const forwardEvents = createEventForwarder(get_current_component(), ["expand", "collapse"]);
    	const headerId = uid("fds-expander-header-");
    	const contentId = uid("fds-expander-content-");

    	function handleKeydown({ key }) {
    		if (key === "Enter" || key === " ") {
    			event.preventDefault();
    			$$invalidate(0, expanded = !expanded);
    		}
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			headerElement = $$value;
    			$$invalidate(2, headerElement);
    		});
    	}

    	const click_handler = () => $$invalidate(0, expanded = !expanded);

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			contentElement = $$value;
    			$$invalidate(3, contentElement);
    		});
    	}

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			containerElement = $$value;
    			$$invalidate(1, containerElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(10, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('expanded' in $$new_props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ('direction' in $$new_props) $$invalidate(4, direction = $$new_props.direction);
    		if ('headingLevel' in $$new_props) $$invalidate(12, headingLevel = $$new_props.headingLevel);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('containerElement' in $$new_props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('headerElement' in $$new_props) $$invalidate(2, headerElement = $$new_props.headerElement);
    		if ('contentElement' in $$new_props) $$invalidate(3, contentElement = $$new_props.contentElement);
    		if ('$$scope' in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		get_current_component,
    		createEventForwarder,
    		uid,
    		expanded,
    		direction,
    		headingLevel,
    		className,
    		containerElement,
    		headerElement,
    		contentElement,
    		dispatch,
    		forwardEvents,
    		headerId,
    		contentId,
    		handleKeydown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$new_props.expanded);
    		if ('direction' in $$props) $$invalidate(4, direction = $$new_props.direction);
    		if ('headingLevel' in $$props) $$invalidate(12, headingLevel = $$new_props.headingLevel);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('containerElement' in $$props) $$invalidate(1, containerElement = $$new_props.containerElement);
    		if ('headerElement' in $$props) $$invalidate(2, headerElement = $$new_props.headerElement);
    		if ('contentElement' in $$props) $$invalidate(3, contentElement = $$new_props.contentElement);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*expanded*/ 1) {
    			if (expanded) {
    				dispatch("expand");
    			} else {
    				dispatch("collapse");
    			}
    		}
    	};

    	return [
    		expanded,
    		containerElement,
    		headerElement,
    		contentElement,
    		direction,
    		className,
    		forwardEvents,
    		headerId,
    		contentId,
    		handleKeydown,
    		$$restProps,
    		$$slots,
    		headingLevel,
    		$$scope,
    		slots,
    		div0_binding,
    		click_handler,
    		div1_binding,
    		div3_binding
    	];
    }

    class Expander extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			expanded: 0,
    			direction: 4,
    			headingLevel: 12,
    			class: 5,
    			containerElement: 1,
    			headerElement: 2,
    			contentElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Expander",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get expanded() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headingLevel() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headingLevel(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get containerElement() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set containerElement(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headerElement() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headerElement(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contentElement() {
    		throw new Error("<Expander>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contentElement(value) {
    		throw new Error("<Expander>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/IconButton/IconButton.svelte generated by Svelte v3.59.2 */
    const file$b = "node_modules/fluent-svelte/IconButton/IconButton.svelte";

    // (28:0) <svelte:element  this={href && !disabled ? "a" : "button"}  use:forwardEvents  bind:this={element}  role={href && !disabled ? "button" : undefined}  href={href && !disabled ? href : undefined}  class="icon-button {className}"  class:disabled  {...$$restProps} >
    function create_dynamic_element(ctx) {
    	let svelte_element;
    	let svelte_element_role_value;
    	let svelte_element_href_value;
    	let svelte_element_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	let svelte_element_levels = [
    		{
    			role: svelte_element_role_value = /*href*/ ctx[1] && !/*disabled*/ ctx[2]
    			? "button"
    			: undefined
    		},
    		{
    			href: svelte_element_href_value = /*href*/ ctx[1] && !/*disabled*/ ctx[2]
    			? /*href*/ ctx[1]
    			: undefined
    		},
    		{
    			class: svelte_element_class_value = "icon-button " + /*className*/ ctx[3]
    		},
    		/*$$restProps*/ ctx[5]
    	];

    	let svelte_element_data = {};

    	for (let i = 0; i < svelte_element_levels.length; i += 1) {
    		svelte_element_data = assign(svelte_element_data, svelte_element_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			svelte_element = element(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button");
    			if (default_slot) default_slot.c();
    			set_dynamic_element_data(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button")(svelte_element, svelte_element_data);
    			toggle_class(svelte_element, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(svelte_element, "svelte-1iys5lx", true);
    			add_location(svelte_element, file$b, 27, 0, 1179);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svelte_element, anchor);

    			if (default_slot) {
    				default_slot.m(svelte_element, null);
    			}

    			/*svelte_element_binding*/ ctx[8](svelte_element);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*forwardEvents*/ ctx[4].call(null, svelte_element));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_dynamic_element_data(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button")(svelte_element, svelte_element_data = get_spread_update(svelte_element_levels, [
    				(!current || dirty & /*href, disabled*/ 6 && svelte_element_role_value !== (svelte_element_role_value = /*href*/ ctx[1] && !/*disabled*/ ctx[2]
    				? "button"
    				: undefined)) && { role: svelte_element_role_value },
    				(!current || dirty & /*href, disabled*/ 6 && svelte_element_href_value !== (svelte_element_href_value = /*href*/ ctx[1] && !/*disabled*/ ctx[2]
    				? /*href*/ ctx[1]
    				: undefined)) && { href: svelte_element_href_value },
    				(!current || dirty & /*className*/ 8 && svelte_element_class_value !== (svelte_element_class_value = "icon-button " + /*className*/ ctx[3])) && { class: svelte_element_class_value },
    				dirty & /*$$restProps*/ 32 && /*$$restProps*/ ctx[5]
    			]));

    			toggle_class(svelte_element, "disabled", /*disabled*/ ctx[2]);
    			toggle_class(svelte_element, "svelte-1iys5lx", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element);
    			if (default_slot) default_slot.d(detaching);
    			/*svelte_element_binding*/ ctx[8](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_dynamic_element.name,
    		type: "child_dynamic_element",
    		source: "(28:0) <svelte:element  this={href && !disabled ? \\\"a\\\" : \\\"button\\\"}  use:forwardEvents  bind:this={element}  role={href && !disabled ? \\\"button\\\" : undefined}  href={href && !disabled ? href : undefined}  class=\\\"icon-button {className}\\\"  class:disabled  {...$$restProps} >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let previous_tag = /*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button";
    	let svelte_element_anchor;
    	let current;
    	validate_dynamic_element(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button");
    	validate_void_dynamic_element(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button");
    	let svelte_element = (/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button") && create_dynamic_element(ctx);

    	const block = {
    		c: function create() {
    			if (svelte_element) svelte_element.c();
    			svelte_element_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (svelte_element) svelte_element.m(target, anchor);
    			insert_dev(target, svelte_element_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button") {
    				if (!previous_tag) {
    					svelte_element = create_dynamic_element(ctx);
    					previous_tag = /*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button";
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else if (safe_not_equal(previous_tag, /*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button")) {
    					svelte_element.d(1);
    					validate_dynamic_element(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button");
    					validate_void_dynamic_element(/*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button");
    					svelte_element = create_dynamic_element(ctx);
    					previous_tag = /*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button";
    					svelte_element.c();
    					svelte_element.m(svelte_element_anchor.parentNode, svelte_element_anchor);
    				} else {
    					svelte_element.p(ctx, dirty);
    				}
    			} else if (previous_tag) {
    				svelte_element.d(1);
    				svelte_element = null;
    				previous_tag = /*href*/ ctx[1] && !/*disabled*/ ctx[2] ? "a" : "button";
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(svelte_element);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(svelte_element);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svelte_element_anchor);
    			if (svelte_element) svelte_element.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	const omit_props_names = ["href","disabled","class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('IconButton', slots, ['default']);
    	let { href = "" } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());

    	function svelte_element_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(5, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('href' in $$new_props) $$invalidate(1, href = $$new_props.href);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(3, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		get_current_component,
    		createEventForwarder,
    		href,
    		disabled,
    		className,
    		element,
    		forwardEvents
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('href' in $$props) $$invalidate(1, href = $$new_props.href);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(3, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		element,
    		href,
    		disabled,
    		className,
    		forwardEvents,
    		$$restProps,
    		$$scope,
    		slots,
    		svelte_element_binding
    	];
    }

    class IconButton extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			href: 1,
    			disabled: 2,
    			class: 3,
    			element: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "IconButton",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get href() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<IconButton>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<IconButton>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/MenuBar/MenuBar.svelte generated by Svelte v3.59.2 */
    const file$a = "node_modules/fluent-svelte/MenuBar/MenuBar.svelte";

    function create_fragment$a(ctx) {
    	let ul;
    	let ul_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	let ul_levels = [
    		{
    			class: ul_class_value = "menu-bar " + /*className*/ ctx[1]
    		},
    		{ role: "menubar" },
    		/*$$restProps*/ ctx[2]
    	];

    	let ul_data = {};

    	for (let i = 0; i < ul_levels.length; i += 1) {
    		ul_data = assign(ul_data, ul_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			if (default_slot) default_slot.c();
    			set_attributes(ul, ul_data);
    			toggle_class(ul, "svelte-7u58hw", true);
    			add_location(ul, file$a, 38, 0, 1254);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			if (default_slot) {
    				default_slot.m(ul, null);
    			}

    			/*ul_binding*/ ctx[5](ul);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ul, ul_data = get_spread_update(ul_levels, [
    				(!current || dirty & /*className*/ 2 && ul_class_value !== (ul_class_value = "menu-bar " + /*className*/ ctx[1])) && { class: ul_class_value },
    				{ role: "menubar" },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(ul, "svelte-7u58hw", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (default_slot) default_slot.d(detaching);
    			/*ul_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuBar', slots, ['default']);
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;

    	setContext("sideNavigation", (event, activeItem) => {
    		const { key } = event;
    		let tabOrder = [];

    		for (const child of Array.from(element.children)) {
    			if (isTabbable(child)) tabOrder.push(child);
    		}

    		const activeIndex = tabOrder.indexOf(activeItem);
    		if (tabOrder.length < 0) return;
    		if (key === "ArrowLeft" || key === "ArrowRight") event.preventDefault();

    		if (key === "ArrowLeft") {
    			if (tabOrder[0] === activeItem) {
    				tabOrder[tabOrder.length - 1].focus();
    			} else if (tabOrder.includes(activeItem)) {
    				tabOrder[activeIndex - 1].focus();
    			}
    		} else if (key === "ArrowRight") {
    			if (tabOrder[tabOrder.length - 1] === activeItem) {
    				tabOrder[0].focus();
    			} else if (tabOrder.includes(activeItem)) {
    				tabOrder[activeIndex + 1].focus();
    			}
    		}
    	});

    	function ul_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		isTabbable,
    		className,
    		element
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, className, $$restProps, $$scope, slots, ul_binding];
    }

    class MenuBar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { class: 1, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuBar",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get class() {
    		throw new Error("<MenuBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<MenuBar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<MenuBar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=} start
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0 && stop) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const currentMenu = writable(null);

    /* node_modules/fluent-svelte/MenuBar/MenuBarItem.svelte generated by Svelte v3.59.2 */
    const file$9 = "node_modules/fluent-svelte/MenuBar/MenuBarItem.svelte";
    const get_flyout_slot_changes$3 = dirty => ({});
    const get_flyout_slot_context$3 = ctx => ({});

    // (104:1) {#if $$slots.flyout && open && !disabled}
    function create_if_block$5(ctx) {
    	let div;
    	let menuflyoutsurface;
    	let updating_element;
    	let current;
    	let mounted;
    	let dispose;

    	function menuflyoutsurface_element_binding(value) {
    		/*menuflyoutsurface_element_binding*/ ctx[18](value);
    	}

    	let menuflyoutsurface_props = {
    		$$slots: { default: [create_default_slot$6] },
    		$$scope: { ctx }
    	};

    	if (/*menuElement*/ ctx[3] !== void 0) {
    		menuflyoutsurface_props.element = /*menuElement*/ ctx[3];
    	}

    	menuflyoutsurface = new MenuFlyoutSurface({
    			props: menuflyoutsurface_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(menuflyoutsurface, 'element', menuflyoutsurface_element_binding));
    	/*menuflyoutsurface_binding*/ ctx[19](menuflyoutsurface);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menuflyoutsurface.$$.fragment);
    			attr_dev(div, "class", "menu-flyout-anchor svelte-1r3ld34");
    			add_location(div, file$9, 104, 2, 3041);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menuflyoutsurface, div, null);
    			/*div_binding*/ ctx[21](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(arrowNavigation.call(null, div, { preventTab: true })),
    					action_destroyer(externalMouseEvents.call(null, div, { type: "mousedown", stopPropagation: true })),
    					listen_dev(div, "outermousedown", /*outermousedown_handler*/ ctx[20], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const menuflyoutsurface_changes = {};

    			if (dirty & /*$$scope*/ 33554432) {
    				menuflyoutsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*menuElement*/ 8) {
    				updating_element = true;
    				menuflyoutsurface_changes.element = /*menuElement*/ ctx[3];
    				add_flush_callback(() => updating_element = false);
    			}

    			menuflyoutsurface.$set(menuflyoutsurface_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuflyoutsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuflyoutsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*menuflyoutsurface_binding*/ ctx[19](null);
    			destroy_component(menuflyoutsurface);
    			/*div_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(104:1) {#if $$slots.flyout && open && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (112:3) <MenuFlyoutSurface bind:element={menuElement} bind:this={menu}>
    function create_default_slot$6(ctx) {
    	let current;
    	const flyout_slot_template = /*#slots*/ ctx[17].flyout;
    	const flyout_slot = create_slot(flyout_slot_template, ctx, /*$$scope*/ ctx[25], get_flyout_slot_context$3);

    	const block = {
    		c: function create() {
    			if (flyout_slot) flyout_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (flyout_slot) {
    				flyout_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (flyout_slot) {
    				if (flyout_slot.p && (!current || dirty & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						flyout_slot,
    						flyout_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(flyout_slot_template, /*$$scope*/ ctx[25], dirty, get_flyout_slot_changes$3),
    						get_flyout_slot_context$3
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (flyout_slot) flyout_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(112:3) <MenuFlyoutSurface bind:element={menuElement} bind:this={menu}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let li;
    	let t;
    	let li_class_value;
    	let li_tabindex_value;
    	let li_aria_expanded_value;
    	let li_aria_haspopup_value;
    	let li_aria_controls_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[25], null);
    	let if_block = /*$$slots*/ ctx[14].flyout && /*open*/ ctx[0] && !/*disabled*/ ctx[4] && create_if_block$5(ctx);

    	let li_levels = [
    		{
    			class: li_class_value = "menu-bar-item " + /*className*/ ctx[5]
    		},
    		{ role: "menuitem" },
    		{
    			tabindex: li_tabindex_value = /*disabled*/ ctx[4] ? -1 : 0
    		},
    		{
    			"aria-expanded": li_aria_expanded_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*open*/ ctx[0]
    		},
    		{
    			"aria-haspopup": li_aria_haspopup_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*open*/ ctx[0]
    		},
    		{
    			"aria-controls": li_aria_controls_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*menuId*/ ctx[8]
    		},
    		/*$$restProps*/ ctx[15]
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(li, li_data);
    			toggle_class(li, "disabled", /*disabled*/ ctx[4]);
    			toggle_class(li, "svelte-1r3ld34", true);
    			add_location(li, file$9, 85, 0, 2475);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			append_dev(li, t);
    			if (if_block) if_block.m(li, null);
    			/*li_binding*/ ctx[22](li);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleEscapeKey*/ ctx[10], false, false, false, false),
    					action_destroyer(/*forwardEvents*/ ctx[7].call(null, li)),
    					listen_dev(li, "keydown", /*keydown_handler*/ ctx[23], false, false, false, false),
    					listen_dev(li, "keydown", self(/*handleKeyDown*/ ctx[12]), false, false, false, false),
    					listen_dev(li, "focus", /*handleFocus*/ ctx[13], false, false, false, false),
    					listen_dev(li, "mousedown", /*mousedown_handler*/ ctx[24], false, false, false, false),
    					listen_dev(li, "mouseenter", /*handleMouseEnter*/ ctx[11], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 33554432)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[25],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[25])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[25], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*$$slots*/ ctx[14].flyout && /*open*/ ctx[0] && !/*disabled*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$$slots, open, disabled*/ 16401) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				(!current || dirty & /*className*/ 32 && li_class_value !== (li_class_value = "menu-bar-item " + /*className*/ ctx[5])) && { class: li_class_value },
    				{ role: "menuitem" },
    				(!current || dirty & /*disabled*/ 16 && li_tabindex_value !== (li_tabindex_value = /*disabled*/ ctx[4] ? -1 : 0)) && { tabindex: li_tabindex_value },
    				(!current || dirty & /*$$slots, disabled, open*/ 16401 && li_aria_expanded_value !== (li_aria_expanded_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*open*/ ctx[0])) && { "aria-expanded": li_aria_expanded_value },
    				(!current || dirty & /*$$slots, disabled, open*/ 16401 && li_aria_haspopup_value !== (li_aria_haspopup_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*open*/ ctx[0])) && { "aria-haspopup": li_aria_haspopup_value },
    				(!current || dirty & /*$$slots, disabled*/ 16400 && li_aria_controls_value !== (li_aria_controls_value = /*$$slots*/ ctx[14].flyout && !/*disabled*/ ctx[4] && /*menuId*/ ctx[8])) && { "aria-controls": li_aria_controls_value },
    				dirty & /*$$restProps*/ 32768 && /*$$restProps*/ ctx[15]
    			]));

    			toggle_class(li, "disabled", /*disabled*/ ctx[4]);
    			toggle_class(li, "svelte-1r3ld34", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*li_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	const omit_props_names = ["open","disabled","class","element","anchorElement","menuElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $currentMenu;
    	validate_store(currentMenu, 'currentMenu');
    	component_subscribe($$self, currentMenu, $$value => $$invalidate(16, $currentMenu = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuBarItem', slots, ['default','flyout']);
    	const $$slots = compute_slots(slots);
    	let { open = false } = $$props;
    	let { disabled = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { anchorElement = null } = $$props;
    	let { menuElement = null } = $$props;
    	let menu;
    	const forwardEvents = createEventForwarder(get_current_component(), ["open", "close", "select"]);
    	const dispatch = createEventDispatcher();
    	const menuId = uid("fds-menu-flyout-anchor-");
    	const handleSideNavigation = getContext("sideNavigation");

    	function focusFirstItem() {
    		if (open && menu && tabbable(menuElement).length > 0) tabbable(menuElement)[0].focus();
    	}

    	function handleEscapeKey({ key }) {
    		if (key === "Escape") $$invalidate(0, open = false);
    	}

    	function handleMouseEnter() {
    		if ($currentMenu && $$slots.flyout) {
    			set_store_value(currentMenu, $currentMenu = menu, $currentMenu);
    			$$invalidate(0, open = true);
    		}
    	}

    	function handleKeyDown({ key }) {
    		if (key === "Enter" || key === " ") {
    			event.preventDefault();
    			$$invalidate(0, open = !open);
    		}
    	}

    	function handleFocus() {
    		if (open) {
    			focusFirstItem();
    		} else if ($currentMenu) {
    			set_store_value(currentMenu, $currentMenu = menu, $currentMenu);
    			$$invalidate(0, open = true);
    		}
    	}

    	setContext("closeFlyout", event => {
    		dispatch("select");
    		event.stopPropagation();
    		$$invalidate(0, open = false);
    	});

    	function menuflyoutsurface_element_binding(value) {
    		menuElement = value;
    		$$invalidate(3, menuElement);
    	}

    	function menuflyoutsurface_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menu = $$value;
    			$$invalidate(6, menu);
    		});
    	}

    	const outermousedown_handler = () => $$invalidate(0, open = false);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			anchorElement = $$value;
    			$$invalidate(2, anchorElement);
    		});
    	}

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	const keydown_handler = event => handleSideNavigation(event, element);
    	const mousedown_handler = () => $$invalidate(0, open = !open);

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(15, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('class' in $$new_props) $$invalidate(5, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(1, element = $$new_props.element);
    		if ('anchorElement' in $$new_props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$new_props) $$invalidate(3, menuElement = $$new_props.menuElement);
    		if ('$$scope' in $$new_props) $$invalidate(25, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		currentMenu,
    		tabbable,
    		createEventDispatcher,
    		getContext,
    		setContext,
    		get_current_component,
    		createEventForwarder,
    		arrowNavigation,
    		externalMouseEvents,
    		uid,
    		MenuFlyoutSurface,
    		open,
    		disabled,
    		className,
    		element,
    		anchorElement,
    		menuElement,
    		menu,
    		forwardEvents,
    		dispatch,
    		menuId,
    		handleSideNavigation,
    		focusFirstItem,
    		handleEscapeKey,
    		handleMouseEnter,
    		handleKeyDown,
    		handleFocus,
    		$currentMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('className' in $$props) $$invalidate(5, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(1, element = $$new_props.element);
    		if ('anchorElement' in $$props) $$invalidate(2, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$props) $$invalidate(3, menuElement = $$new_props.menuElement);
    		if ('menu' in $$props) $$invalidate(6, menu = $$new_props.menu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*menu*/ 64) {
    			if (menu) {
    				focusFirstItem();
    				set_store_value(currentMenu, $currentMenu = menu, $currentMenu);
    			} else {
    				set_store_value(currentMenu, $currentMenu = null, $currentMenu);
    			}
    		}

    		if ($$self.$$.dirty & /*$currentMenu, menu*/ 65600) {
    			if ($currentMenu !== menu) $$invalidate(0, open = false);
    		}

    		if ($$self.$$.dirty & /*menu, element*/ 66) {
    			if (!menu && element) element.focus();
    		}

    		if ($$self.$$.dirty & /*open, disabled*/ 17) {
    			if ($$slots.flyout && open && !disabled) {
    				if (open) {
    					dispatch("open");
    				} else {
    					dispatch("close");
    				}
    			}
    		}
    	};

    	return [
    		open,
    		element,
    		anchorElement,
    		menuElement,
    		disabled,
    		className,
    		menu,
    		forwardEvents,
    		menuId,
    		handleSideNavigation,
    		handleEscapeKey,
    		handleMouseEnter,
    		handleKeyDown,
    		handleFocus,
    		$$slots,
    		$$restProps,
    		$currentMenu,
    		slots,
    		menuflyoutsurface_element_binding,
    		menuflyoutsurface_binding,
    		outermousedown_handler,
    		div_binding,
    		li_binding,
    		keydown_handler,
    		mousedown_handler,
    		$$scope
    	];
    }

    class MenuBarItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			open: 0,
    			disabled: 4,
    			class: 5,
    			element: 1,
    			anchorElement: 2,
    			menuElement: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuBarItem",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get open() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorElement() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorElement(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuElement() {
    		throw new Error("<MenuBarItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuElement(value) {
    		throw new Error("<MenuBarItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/MenuFlyout/MenuFlyoutWrapper.svelte generated by Svelte v3.59.2 */
    const file$8 = "node_modules/fluent-svelte/MenuFlyout/MenuFlyoutWrapper.svelte";
    const get_flyout_slot_changes$2 = dirty => ({});
    const get_flyout_slot_context$2 = ctx => ({});

    // (68:1) {#if open}
    function create_if_block$4(ctx) {
    	let div0;
    	let menuflyoutsurface;
    	let updating_element;
    	let div0_class_value;
    	let t;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	const menuflyoutsurface_spread_levels = [/*$$restProps*/ ctx[14]];

    	function menuflyoutsurface_element_binding(value) {
    		/*menuflyoutsurface_element_binding*/ ctx[18](value);
    	}

    	let menuflyoutsurface_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < menuflyoutsurface_spread_levels.length; i += 1) {
    		menuflyoutsurface_props = assign(menuflyoutsurface_props, menuflyoutsurface_spread_levels[i]);
    	}

    	if (/*menuElement*/ ctx[1] !== void 0) {
    		menuflyoutsurface_props.element = /*menuElement*/ ctx[1];
    	}

    	menuflyoutsurface = new MenuFlyoutSurface({
    			props: menuflyoutsurface_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(menuflyoutsurface, 'element', menuflyoutsurface_element_binding));
    	/*menuflyoutsurface_binding*/ ctx[19](menuflyoutsurface);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(menuflyoutsurface.$$.fragment);
    			t = space();
    			div1 = element("div");
    			attr_dev(div0, "id", /*menuId*/ ctx[10]);
    			attr_dev(div0, "class", div0_class_value = "menu-flyout-anchor placement-" + /*placement*/ ctx[5] + " alignment-" + /*alignment*/ ctx[6] + " svelte-as1gqa");
    			set_style(div0, "--fds-menu-flyout-offset", /*offset*/ ctx[7] + "px");
    			attr_dev(div0, "tabindex", "-1");
    			add_location(div0, file$8, 68, 2, 2455);
    			attr_dev(div1, "class", "menu-flyout-backdrop svelte-as1gqa");
    			add_location(div1, file$8, 81, 2, 2879);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(menuflyoutsurface, div0, null);
    			/*div0_binding*/ ctx[20](div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			/*div1_binding*/ ctx[21](div1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(arrowNavigation.call(null, div0, { preventTab: true })),
    					listen_dev(div0, "click", click_handler, false, false, false, false),
    					listen_dev(div1, "click", click_handler_1, false, false, false, false),
    					listen_dev(div1, "mousedown", /*closeFlyout*/ ctx[13], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const menuflyoutsurface_changes = (dirty & /*$$restProps*/ 16384)
    			? get_spread_update(menuflyoutsurface_spread_levels, [get_spread_object(/*$$restProps*/ ctx[14])])
    			: {};

    			if (dirty & /*$$scope*/ 8388608) {
    				menuflyoutsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*menuElement*/ 2) {
    				updating_element = true;
    				menuflyoutsurface_changes.element = /*menuElement*/ ctx[1];
    				add_flush_callback(() => updating_element = false);
    			}

    			menuflyoutsurface.$set(menuflyoutsurface_changes);

    			if (!current || dirty & /*placement, alignment*/ 96 && div0_class_value !== (div0_class_value = "menu-flyout-anchor placement-" + /*placement*/ ctx[5] + " alignment-" + /*alignment*/ ctx[6] + " svelte-as1gqa")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (!current || dirty & /*offset*/ 128) {
    				set_style(div0, "--fds-menu-flyout-offset", /*offset*/ ctx[7] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuflyoutsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuflyoutsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			/*menuflyoutsurface_binding*/ ctx[19](null);
    			destroy_component(menuflyoutsurface);
    			/*div0_binding*/ ctx[20](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[21](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(68:1) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (78:3) <MenuFlyoutSurface bind:element={menuElement} bind:this={menu} {...$$restProps}>
    function create_default_slot$5(ctx) {
    	let current;
    	const flyout_slot_template = /*#slots*/ ctx[17].flyout;
    	const flyout_slot = create_slot(flyout_slot_template, ctx, /*$$scope*/ ctx[23], get_flyout_slot_context$2);

    	const block = {
    		c: function create() {
    			if (flyout_slot) flyout_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (flyout_slot) {
    				flyout_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (flyout_slot) {
    				if (flyout_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						flyout_slot,
    						flyout_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(flyout_slot_template, /*$$scope*/ ctx[23], dirty, get_flyout_slot_changes$2),
    						get_flyout_slot_context$2
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (flyout_slot) flyout_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(78:3) <MenuFlyoutSurface bind:element={menuElement} bind:this={menu} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let div;
    	let t;
    	let div_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[23], null);
    	let if_block = /*open*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", div_class_value = "menu-flyout-wrapper " + /*className*/ ctx[8] + " svelte-as1gqa");
    			attr_dev(div, "aria-expanded", /*open*/ ctx[0]);
    			attr_dev(div, "aria-haspopup", /*open*/ ctx[0]);
    			attr_dev(div, "aria-controls", /*menuId*/ ctx[10]);
    			add_location(div, file$8, 58, 0, 2262);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding*/ ctx[22](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*handleEscapeKey*/ ctx[11], false, false, false, false),
    					listen_dev(div, "click", /*toggleFlyout*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8388608)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[23],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[23])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[23], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*className*/ 256 && div_class_value !== (div_class_value = "menu-flyout-wrapper " + /*className*/ ctx[8] + " svelte-as1gqa")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(div, "aria-expanded", /*open*/ ctx[0]);
    			}

    			if (!current || dirty & /*open*/ 1) {
    				attr_dev(div, "aria-haspopup", /*open*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding*/ ctx[22](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = e => e.stopPropagation();
    const click_handler_1 = e => e.stopPropagation();

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"open","closable","closeOnSelect","placement","alignment","offset","class","wrapperElement","anchorElement","menuElement","backdropElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuFlyoutWrapper', slots, ['default','flyout']);
    	let { open = false } = $$props;
    	let { closable = true } = $$props;
    	let { closeOnSelect = true } = $$props;
    	let { placement = "top" } = $$props;
    	let { alignment = "center" } = $$props;
    	let { offset = 4 } = $$props;
    	let { class: className = "" } = $$props;
    	let { wrapperElement = null } = $$props;
    	let { anchorElement = null } = $$props;
    	let { menuElement = null } = $$props;
    	let { backdropElement = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const menuId = uid("fds-menu-flyout-anchor-");
    	let menu = null;
    	let previousFocus = null;

    	function handleEscapeKey({ key }) {
    		if (key === "Escape" && closable) $$invalidate(0, open = false);

    		previousFocus === null || previousFocus === void 0
    		? void 0
    		: previousFocus.focus();
    	}

    	function toggleFlyout() {
    		previousFocus = document.activeElement;
    		$$invalidate(0, open = !open);
    	}

    	function closeFlyout() {
    		if (closable) $$invalidate(0, open = false);
    	}

    	setContext("closeFlyout", event => {
    		dispatch("select");

    		if (closeOnSelect && closable) {
    			event.stopPropagation();
    			$$invalidate(0, open = false);
    		}
    	});

    	function menuflyoutsurface_element_binding(value) {
    		menuElement = value;
    		$$invalidate(1, menuElement);
    	}

    	function menuflyoutsurface_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menu = $$value;
    			$$invalidate(9, menu);
    		});
    	}

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			anchorElement = $$value;
    			$$invalidate(3, anchorElement);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			backdropElement = $$value;
    			$$invalidate(4, backdropElement);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapperElement = $$value;
    			$$invalidate(2, wrapperElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(14, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$new_props) $$invalidate(15, closable = $$new_props.closable);
    		if ('closeOnSelect' in $$new_props) $$invalidate(16, closeOnSelect = $$new_props.closeOnSelect);
    		if ('placement' in $$new_props) $$invalidate(5, placement = $$new_props.placement);
    		if ('alignment' in $$new_props) $$invalidate(6, alignment = $$new_props.alignment);
    		if ('offset' in $$new_props) $$invalidate(7, offset = $$new_props.offset);
    		if ('class' in $$new_props) $$invalidate(8, className = $$new_props.class);
    		if ('wrapperElement' in $$new_props) $$invalidate(2, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$new_props) $$invalidate(3, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$new_props) $$invalidate(1, menuElement = $$new_props.menuElement);
    		if ('backdropElement' in $$new_props) $$invalidate(4, backdropElement = $$new_props.backdropElement);
    		if ('$$scope' in $$new_props) $$invalidate(23, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		tabbable,
    		createEventDispatcher,
    		setContext,
    		arrowNavigation,
    		uid,
    		MenuFlyoutSurface,
    		open,
    		closable,
    		closeOnSelect,
    		placement,
    		alignment,
    		offset,
    		className,
    		wrapperElement,
    		anchorElement,
    		menuElement,
    		backdropElement,
    		dispatch,
    		menuId,
    		menu,
    		previousFocus,
    		handleEscapeKey,
    		toggleFlyout,
    		closeFlyout
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('closable' in $$props) $$invalidate(15, closable = $$new_props.closable);
    		if ('closeOnSelect' in $$props) $$invalidate(16, closeOnSelect = $$new_props.closeOnSelect);
    		if ('placement' in $$props) $$invalidate(5, placement = $$new_props.placement);
    		if ('alignment' in $$props) $$invalidate(6, alignment = $$new_props.alignment);
    		if ('offset' in $$props) $$invalidate(7, offset = $$new_props.offset);
    		if ('className' in $$props) $$invalidate(8, className = $$new_props.className);
    		if ('wrapperElement' in $$props) $$invalidate(2, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$props) $$invalidate(3, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$props) $$invalidate(1, menuElement = $$new_props.menuElement);
    		if ('backdropElement' in $$props) $$invalidate(4, backdropElement = $$new_props.backdropElement);
    		if ('menu' in $$props) $$invalidate(9, menu = $$new_props.menu);
    		if ('previousFocus' in $$props) previousFocus = $$new_props.previousFocus;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			dispatch(open ? "open" : "close");
    		}

    		if ($$self.$$.dirty & /*menu, menuElement*/ 514) {
    			if (menu && tabbable(menuElement).length > 0) tabbable(menuElement)[0].focus();
    		}
    	};

    	return [
    		open,
    		menuElement,
    		wrapperElement,
    		anchorElement,
    		backdropElement,
    		placement,
    		alignment,
    		offset,
    		className,
    		menu,
    		menuId,
    		handleEscapeKey,
    		toggleFlyout,
    		closeFlyout,
    		$$restProps,
    		closable,
    		closeOnSelect,
    		slots,
    		menuflyoutsurface_element_binding,
    		menuflyoutsurface_binding,
    		div0_binding,
    		div1_binding,
    		div_binding,
    		$$scope
    	];
    }

    class MenuFlyoutWrapper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			open: 0,
    			closable: 15,
    			closeOnSelect: 16,
    			placement: 5,
    			alignment: 6,
    			offset: 7,
    			class: 8,
    			wrapperElement: 2,
    			anchorElement: 3,
    			menuElement: 1,
    			backdropElement: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuFlyoutWrapper",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get open() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closeOnSelect() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnSelect(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapperElement() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapperElement(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorElement() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorElement(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuElement() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuElement(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backdropElement() {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backdropElement(value) {
    		throw new Error("<MenuFlyoutWrapper>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/MenuFlyout/MenuFlyoutItem.svelte generated by Svelte v3.59.2 */
    const file$7 = "node_modules/fluent-svelte/MenuFlyout/MenuFlyoutItem.svelte";
    const get_icon_slot_changes_1 = dirty => ({});
    const get_icon_slot_context_1 = ctx => ({ slot: "icon" });
    const get_flyout_slot_changes$1 = dirty => ({});
    const get_flyout_slot_context$1 = ctx => ({});
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (151:54) 
    function create_if_block_4(ctx) {
    	let label;
    	let menuflyoutitem;
    	let t;
    	let current;

    	menuflyoutitem = new MenuFlyoutItem({
    			props: {
    				checked: /*checked*/ ctx[2] || /*group*/ ctx[3] === /*value*/ ctx[4],
    				selected: /*selected*/ ctx[12],
    				variant: /*variant*/ ctx[9],
    				indented: /*indented*/ ctx[13],
    				group: /*group*/ ctx[3],
    				disabled: /*disabled*/ ctx[14],
    				__depth: true,
    				$$slots: {
    					icon: [create_icon_slot],
    					default: [create_default_slot_2$2]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function select_block_type_1(ctx, dirty) {
    		if (/*variant*/ ctx[9] === "radio") return create_if_block_5;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			label = element("label");
    			create_component(menuflyoutitem.$$.fragment);
    			t = space();
    			if_block.c();
    			attr_dev(label, "class", "menu-flyout-item-input-label svelte-s7v067");
    			add_location(label, file$7, 152, 1, 5868);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			mount_component(menuflyoutitem, label, null);
    			append_dev(label, t);
    			if_block.m(label, null);
    			/*label_binding*/ ctx[42](label);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const menuflyoutitem_changes = {};
    			if (dirty[0] & /*checked, group, value*/ 28) menuflyoutitem_changes.checked = /*checked*/ ctx[2] || /*group*/ ctx[3] === /*value*/ ctx[4];
    			if (dirty[0] & /*selected*/ 4096) menuflyoutitem_changes.selected = /*selected*/ ctx[12];
    			if (dirty[0] & /*variant*/ 512) menuflyoutitem_changes.variant = /*variant*/ ctx[9];
    			if (dirty[0] & /*indented*/ 8192) menuflyoutitem_changes.indented = /*indented*/ ctx[13];
    			if (dirty[0] & /*group*/ 8) menuflyoutitem_changes.group = /*group*/ ctx[3];
    			if (dirty[0] & /*disabled*/ 16384) menuflyoutitem_changes.disabled = /*disabled*/ ctx[14];

    			if (dirty[0] & /*variant*/ 512 | dirty[1] & /*$$scope*/ 4096) {
    				menuflyoutitem_changes.$$scope = { dirty, ctx };
    			}

    			menuflyoutitem.$set(menuflyoutitem_changes);

    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(label, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuflyoutitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuflyoutitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			destroy_component(menuflyoutitem);
    			if_block.d();
    			/*label_binding*/ ctx[42](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(151:54) ",
    		ctx
    	});

    	return block;
    }

    // (96:0) {#if variant === "standard" || __depth}
    function create_if_block$3(ctx) {
    	let li;
    	let t0;
    	let t1;
    	let t2;
    	let li_tabindex_value;
    	let li_aria_expanded_value;
    	let li_aria_haspopup_value;
    	let li_aria_controls_value;
    	let li_aria_selected_value;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[26].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[43], get_icon_slot_context);
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);
    	let if_block0 = /*hint*/ ctx[11] && create_if_block_3$1(ctx);
    	let if_block1 = /*cascading*/ ctx[10] && create_if_block_1$2(ctx);

    	let li_levels = [
    		{
    			tabindex: li_tabindex_value = /*disabled*/ ctx[14] ? -1 : 0
    		},
    		{ role: "menuitem" },
    		{
    			"aria-expanded": li_aria_expanded_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*open*/ ctx[0]
    		},
    		{
    			"aria-haspopup": li_aria_haspopup_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*open*/ ctx[0]
    		},
    		{
    			"aria-controls": li_aria_controls_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*menuId*/ ctx[19]
    		},
    		{
    			"aria-selected": li_aria_selected_value = /*selected*/ ctx[12] || /*checked*/ ctx[2]
    		},
    		{
    			class: li_class_value = "menu-flyout-item type-" + /*variant*/ ctx[9] + " " + /*className*/ ctx[16]
    		},
    		/*$$restProps*/ ctx[25]
    	];

    	let li_data = {};

    	for (let i = 0; i < li_levels.length; i += 1) {
    		li_data = assign(li_data, li_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			if (icon_slot) icon_slot.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(li, li_data);
    			toggle_class(li, "cascading", /*cascading*/ ctx[10]);
    			toggle_class(li, "selected", /*selected*/ ctx[12]);
    			toggle_class(li, "checked", /*checked*/ ctx[2]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[14]);
    			toggle_class(li, "indented", /*indented*/ ctx[13]);
    			toggle_class(li, "svelte-s7v067", true);
    			add_location(li, file$7, 96, 1, 4101);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);

    			if (icon_slot) {
    				icon_slot.m(li, null);
    			}

    			append_dev(li, t0);

    			if (default_slot) {
    				default_slot.m(li, null);
    			}

    			append_dev(li, t1);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t2);
    			if (if_block1) if_block1.m(li, null);
    			/*li_binding*/ ctx[36](li);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*forwardEvents*/ ctx[18].call(null, li)),
    					listen_dev(li, "click", /*close*/ ctx[20], false, false, false, false),
    					listen_dev(li, "mouseenter", /*handleMouseEnter*/ ctx[22], false, false, false, false),
    					listen_dev(li, "mouseleave", /*handleMouseLeave*/ ctx[23], false, false, false, false),
    					listen_dev(li, "keydown", /*handleKeyDown*/ ctx[21], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[43], dirty, get_icon_slot_changes),
    						get_icon_slot_context
    					);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*hint*/ ctx[11]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*hint*/ 2048) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(li, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*cascading*/ ctx[10]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*cascading*/ 1024) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(li, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			set_attributes(li, li_data = get_spread_update(li_levels, [
    				(!current || dirty[0] & /*disabled*/ 16384 && li_tabindex_value !== (li_tabindex_value = /*disabled*/ ctx[14] ? -1 : 0)) && { tabindex: li_tabindex_value },
    				{ role: "menuitem" },
    				(!current || dirty[0] & /*$$slots, disabled, open*/ 16793601 && li_aria_expanded_value !== (li_aria_expanded_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*open*/ ctx[0])) && { "aria-expanded": li_aria_expanded_value },
    				(!current || dirty[0] & /*$$slots, disabled, open*/ 16793601 && li_aria_haspopup_value !== (li_aria_haspopup_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*open*/ ctx[0])) && { "aria-haspopup": li_aria_haspopup_value },
    				(!current || dirty[0] & /*$$slots, disabled*/ 16793600 && li_aria_controls_value !== (li_aria_controls_value = /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && /*menuId*/ ctx[19])) && { "aria-controls": li_aria_controls_value },
    				(!current || dirty[0] & /*selected, checked*/ 4100 && li_aria_selected_value !== (li_aria_selected_value = /*selected*/ ctx[12] || /*checked*/ ctx[2])) && { "aria-selected": li_aria_selected_value },
    				(!current || dirty[0] & /*variant, className*/ 66048 && li_class_value !== (li_class_value = "menu-flyout-item type-" + /*variant*/ ctx[9] + " " + /*className*/ ctx[16])) && { class: li_class_value },
    				dirty[0] & /*$$restProps*/ 33554432 && /*$$restProps*/ ctx[25]
    			]));

    			toggle_class(li, "cascading", /*cascading*/ ctx[10]);
    			toggle_class(li, "selected", /*selected*/ ctx[12]);
    			toggle_class(li, "checked", /*checked*/ ctx[2]);
    			toggle_class(li, "disabled", /*disabled*/ ctx[14]);
    			toggle_class(li, "indented", /*indented*/ ctx[13]);
    			toggle_class(li, "svelte-s7v067", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(default_slot, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(default_slot, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (icon_slot) icon_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			/*li_binding*/ ctx[36](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(96:0) {#if variant === \\\"standard\\\" || __depth}",
    		ctx
    	});

    	return block;
    }

    // (165:4) {#if variant === "toggle"}
    function create_if_block_6(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M9.85355 3.14645C10.0488 3.34171 10.0488 3.65829 9.85355 3.85355L5.35355 8.35355C5.15829 8.54882 4.84171 8.54882 4.64645 8.35355L2.64645 6.35355C2.45118 6.15829 2.45118 5.84171 2.64645 5.64645C2.84171 5.45118 3.15829 5.45118 3.35355 5.64645L5 7.29289L9.14645 3.14645C9.34171 2.95118 9.65829 2.95118 9.85355 3.14645Z");
    			attr_dev(path, "fill", "currentColor");
    			add_location(path, file$7, 172, 6, 6370);
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$7, 165, 5, 6232);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(165:4) {#if variant === \\\"toggle\\\"}",
    		ctx
    	});

    	return block;
    }

    // (154:2) <svelte:self    checked={checked || group === value}    {selected}    {variant}    {indented}    {group}    {disabled}    __depth   >
    function create_default_slot_2$2(ctx) {
    	let div;
    	let div_class_value;
    	let t;
    	let current;
    	let if_block = /*variant*/ ctx[9] === "toggle" && create_if_block_6(ctx);
    	const default_slot_template = /*#slots*/ ctx[26].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[43], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t = space();
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "menu-flyout-item-" + (/*variant*/ ctx[9] === 'radio' ? 'bullet' : 'checkmark') + " svelte-s7v067");
    			add_location(div, file$7, 163, 3, 6118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*variant*/ ctx[9] === "toggle") {
    				if (if_block) ; else {
    					if_block = create_if_block_6(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty[0] & /*variant*/ 512 && div_class_value !== (div_class_value = "menu-flyout-item-" + (/*variant*/ ctx[9] === 'radio' ? 'bullet' : 'checkmark') + " svelte-s7v067")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[43], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(154:2) <svelte:self    checked={checked || group === value}    {selected}    {variant}    {indented}    {group}    {disabled}    __depth   >",
    		ctx
    	});

    	return block;
    }

    // (163:3) 
    function create_icon_slot(ctx) {
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[26].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[43], get_icon_slot_context_1);

    	const block = {
    		c: function create() {
    			if (icon_slot) icon_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (icon_slot) {
    				icon_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						icon_slot,
    						icon_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(icon_slot_template, /*$$scope*/ ctx[43], dirty, get_icon_slot_changes_1),
    						get_icon_slot_context_1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (icon_slot) icon_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_icon_slot.name,
    		type: "slot",
    		source: "(163:3) ",
    		ctx
    	});

    	return block;
    }

    // (196:2) {:else}
    function create_else_block$1(ctx) {
    	let input;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[38][0]);

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "checkbox");
    			input.hidden = true;
    			input.disabled = /*disabled*/ ctx[14];
    			add_location(input, file$7, 196, 3, 7017);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			/*input_binding_1*/ ctx[40](input);
    			input.checked = ~(/*group*/ ctx[3] || []).indexOf(input.__value);
    			input.checked = /*checked*/ ctx[2];
    			set_input_value(input, /*value*/ ctx[4]);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler_1*/ ctx[30], false, false, false, false),
    					listen_dev(input, "input", /*input_handler_1*/ ctx[31], false, false, false, false),
    					listen_dev(input, "beforeinput", /*beforeinput_handler_1*/ ctx[32], false, false, false, false),
    					listen_dev(input, "change", /*input_change_handler_1*/ ctx[41])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*disabled*/ 16384) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[14]);
    			}

    			if (dirty[0] & /*group*/ 8) {
    				input.checked = ~(/*group*/ ctx[3] || []).indexOf(input.__value);
    			}

    			if (dirty[0] & /*checked*/ 4) {
    				input.checked = /*checked*/ ctx[2];
    			}

    			if (dirty[0] & /*value*/ 16) {
    				set_input_value(input, /*value*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_1*/ ctx[40](null);
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(196:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (183:2) {#if variant === "radio"}
    function create_if_block_5(ctx) {
    	let input;
    	let value_has_changed = false;
    	let binding_group;
    	let mounted;
    	let dispose;
    	binding_group = init_binding_group(/*$$binding_groups*/ ctx[38][0]);

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "radio");
    			input.hidden = true;
    			input.__value = /*value*/ ctx[4];
    			input.value = input.__value;
    			input.checked = /*checked*/ ctx[2];
    			input.disabled = /*disabled*/ ctx[14];
    			add_location(input, file$7, 183, 3, 6832);
    			binding_group.p(input);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			input.checked = input.__value === /*group*/ ctx[3];
    			/*input_binding*/ ctx[39](input);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[27], false, false, false, false),
    					listen_dev(input, "input", /*input_handler*/ ctx[28], false, false, false, false),
    					listen_dev(input, "beforeinput", /*beforeinput_handler*/ ctx[29], false, false, false, false),
    					listen_dev(input, "change", /*input_change_handler*/ ctx[37])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*value*/ 16) {
    				prop_dev(input, "__value", /*value*/ ctx[4]);
    				input.value = input.__value;
    				value_has_changed = true;
    			}

    			if (dirty[0] & /*checked*/ 4) {
    				prop_dev(input, "checked", /*checked*/ ctx[2]);
    			}

    			if (dirty[0] & /*disabled*/ 16384) {
    				prop_dev(input, "disabled", /*disabled*/ ctx[14]);
    			}

    			if (value_has_changed || dirty[0] & /*group*/ 8) {
    				input.checked = input.__value === /*group*/ ctx[3];
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[39](null);
    			binding_group.r();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(183:2) {#if variant === \\\"radio\\\"}",
    		ctx
    	});

    	return block;
    }

    // (120:2) {#if hint}
    function create_if_block_3$1(ctx) {
    	let textblock;
    	let current;

    	textblock = new TextBlock({
    			props: {
    				class: "menu-flyout-item-hint",
    				variant: "caption",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(textblock.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(textblock, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const textblock_changes = {};

    			if (dirty[0] & /*hint*/ 2048 | dirty[1] & /*$$scope*/ 4096) {
    				textblock_changes.$$scope = { dirty, ctx };
    			}

    			textblock.$set(textblock_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(textblock.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(textblock.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(textblock, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(120:2) {#if hint}",
    		ctx
    	});

    	return block;
    }

    // (121:3) <TextBlock class="menu-flyout-item-hint" variant="caption">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*hint*/ ctx[11]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*hint*/ 2048) set_data_dev(t, /*hint*/ ctx[11]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(121:3) <TextBlock class=\\\"menu-flyout-item-hint\\\" variant=\\\"caption\\\">",
    		ctx
    	});

    	return block;
    }

    // (123:2) {#if cascading}
    function create_if_block_1$2(ctx) {
    	let svg;
    	let path;
    	let t;
    	let if_block_anchor;
    	let current;
    	let if_block = /*open*/ ctx[0] && /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14] && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			attr_dev(path, "d", "M4.64645 2.14645C4.45118 2.34171 4.45118 2.65829 4.64645 2.85355L7.79289 6L4.64645 9.14645C4.45118 9.34171 4.45118 9.65829 4.64645 9.85355C4.84171 10.0488 5.15829 10.0488 5.35355 9.85355L8.85355 6.35355C9.04882 6.15829 9.04882 5.84171 8.85355 5.64645L5.35355 2.14645C5.15829 1.95118 4.84171 1.95118 4.64645 2.14645Z");
    			attr_dev(path, "fill", "currentColor");
    			add_location(path, file$7, 131, 4, 4993);
    			attr_dev(svg, "class", "menu-flyout-item-arrow svelte-s7v067");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 12 12");
    			attr_dev(svg, "fill", "none");
    			add_location(svg, file$7, 123, 3, 4834);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*open*/ ctx[0] && /*$$slots*/ ctx[24].flyout && !/*disabled*/ ctx[14]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*open, $$slots, disabled*/ 16793601) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(123:2) {#if cascading}",
    		ctx
    	});

    	return block;
    }

    // (137:3) {#if open && $$slots.flyout && !disabled}
    function create_if_block_2$1(ctx) {
    	let div;
    	let menuflyoutsurface;
    	let updating_element;
    	let current;
    	let mounted;
    	let dispose;

    	function menuflyoutsurface_element_binding(value) {
    		/*menuflyoutsurface_element_binding*/ ctx[33](value);
    	}

    	let menuflyoutsurface_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	if (/*subMenuElement*/ ctx[1] !== void 0) {
    		menuflyoutsurface_props.element = /*subMenuElement*/ ctx[1];
    	}

    	menuflyoutsurface = new MenuFlyoutSurface({
    			props: menuflyoutsurface_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(menuflyoutsurface, 'element', menuflyoutsurface_element_binding));
    	/*menuflyoutsurface_binding*/ ctx[34](menuflyoutsurface);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menuflyoutsurface.$$.fragment);
    			attr_dev(div, "id", /*menuId*/ ctx[19]);
    			attr_dev(div, "class", "menu-flyout-submenu-anchor svelte-s7v067");
    			add_location(div, file$7, 137, 4, 5415);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menuflyoutsurface, div, null);
    			/*div_binding*/ ctx[35](div);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(arrowNavigation.call(null, div, { preventTab: true, stopPropagation: true }));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const menuflyoutsurface_changes = {};

    			if (dirty[1] & /*$$scope*/ 4096) {
    				menuflyoutsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty[0] & /*subMenuElement*/ 2) {
    				updating_element = true;
    				menuflyoutsurface_changes.element = /*subMenuElement*/ ctx[1];
    				add_flush_callback(() => updating_element = false);
    			}

    			menuflyoutsurface.$set(menuflyoutsurface_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuflyoutsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuflyoutsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*menuflyoutsurface_binding*/ ctx[34](null);
    			destroy_component(menuflyoutsurface);
    			/*div_binding*/ ctx[35](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(137:3) {#if open && $$slots.flyout && !disabled}",
    		ctx
    	});

    	return block;
    }

    // (144:5) <MenuFlyoutSurface bind:element={subMenuElement} bind:this={menu}>
    function create_default_slot$4(ctx) {
    	let current;
    	const flyout_slot_template = /*#slots*/ ctx[26].flyout;
    	const flyout_slot = create_slot(flyout_slot_template, ctx, /*$$scope*/ ctx[43], get_flyout_slot_context$1);

    	const block = {
    		c: function create() {
    			if (flyout_slot) flyout_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (flyout_slot) {
    				flyout_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (flyout_slot) {
    				if (flyout_slot.p && (!current || dirty[1] & /*$$scope*/ 4096)) {
    					update_slot_base(
    						flyout_slot,
    						flyout_slot_template,
    						ctx,
    						/*$$scope*/ ctx[43],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[43])
    						: get_slot_changes(flyout_slot_template, /*$$scope*/ ctx[43], dirty, get_flyout_slot_changes$1),
    						get_flyout_slot_context$1
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (flyout_slot) flyout_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(144:5) <MenuFlyoutSurface bind:element={subMenuElement} bind:this={menu}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_if_block_4];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*variant*/ ctx[9] === "standard" || /*__depth*/ ctx[15]) return 0;
    		if (/*variant*/ ctx[9] === "radio" || /*variant*/ ctx[9] === "toggle") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"variant","cascading","hint","selected","checked","indented","group","value","disabled","open","__depth","class","element","inputElement","inputLabelElement","subMenuAnchorElement","subMenuElement"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuFlyoutItem', slots, ['icon','default','flyout']);
    	const $$slots = compute_slots(slots);
    	let { variant = "standard" } = $$props;
    	let { cascading = false } = $$props;
    	let { hint = undefined } = $$props;
    	let { selected = false } = $$props;
    	let { checked = false } = $$props;
    	let { indented = false } = $$props;
    	let { group = [] } = $$props;
    	let { value = undefined } = $$props;
    	let { disabled = false } = $$props;
    	let { open = false } = $$props;
    	let { __depth = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	let { inputElement = null } = $$props;
    	let { inputLabelElement = null } = $$props;
    	let { subMenuAnchorElement = null } = $$props;
    	let { subMenuElement = null } = $$props;
    	const forwardEvents = createEventForwarder(get_current_component());
    	const dispatch = createEventDispatcher();
    	const closeFlyout = getContext("closeFlyout");
    	const menuId = uid("fds-menu-flyout-submenu-");
    	let menu = null;
    	let subMenuQueue = { open: false, close: false };

    	function close(event) {
    		setTimeout(() => {
    			if (!cascading && closeFlyout) closeFlyout(event);
    		});
    	}

    	function handleKeyDown(event) {
    		const { key, target } = event;

    		if (key === "Enter" || key === " ") {
    			event.preventDefault();
    			target.click();
    		}

    		if (cascading) {
    			if (key === "ArrowRight") {
    				event.stopPropagation();
    				$$invalidate(0, open = true);
    			} else if (open && key === "ArrowLeft") {
    				event.stopPropagation();
    				$$invalidate(0, open = false);
    				element.focus();
    			}
    		}
    	}

    	function handleMouseEnter() {
    		subMenuQueue.close = false;
    		subMenuQueue.open = true;

    		setTimeout(
    			() => {
    				if (subMenuQueue.open) $$invalidate(0, open = true);
    			},
    			500
    		);
    	}

    	function handleMouseLeave() {
    		subMenuQueue.close = true;
    		subMenuQueue.open = false;

    		setTimeout(
    			() => {
    				if (subMenuQueue.close) $$invalidate(0, open = false);
    			},
    			500
    		);
    	}

    	const $$binding_groups = [[]];

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function beforeinput_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function menuflyoutsurface_element_binding(value) {
    		subMenuElement = value;
    		$$invalidate(1, subMenuElement);
    	}

    	function menuflyoutsurface_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menu = $$value;
    			$$invalidate(17, menu);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			subMenuAnchorElement = $$value;
    			$$invalidate(8, subMenuAnchorElement);
    		});
    	}

    	function li_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(3, group);
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(6, inputElement);
    		});
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputElement = $$value;
    			$$invalidate(6, inputElement);
    		});
    	}

    	function input_change_handler_1() {
    		group = get_binding_group_value($$binding_groups[0], this.__value, this.checked);
    		checked = this.checked;
    		value = this.value;
    		$$invalidate(3, group);
    		$$invalidate(2, checked);
    		$$invalidate(4, value);
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			inputLabelElement = $$value;
    			$$invalidate(7, inputLabelElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(25, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('variant' in $$new_props) $$invalidate(9, variant = $$new_props.variant);
    		if ('cascading' in $$new_props) $$invalidate(10, cascading = $$new_props.cascading);
    		if ('hint' in $$new_props) $$invalidate(11, hint = $$new_props.hint);
    		if ('selected' in $$new_props) $$invalidate(12, selected = $$new_props.selected);
    		if ('checked' in $$new_props) $$invalidate(2, checked = $$new_props.checked);
    		if ('indented' in $$new_props) $$invalidate(13, indented = $$new_props.indented);
    		if ('group' in $$new_props) $$invalidate(3, group = $$new_props.group);
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$new_props) $$invalidate(14, disabled = $$new_props.disabled);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('__depth' in $$new_props) $$invalidate(15, __depth = $$new_props.__depth);
    		if ('class' in $$new_props) $$invalidate(16, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(5, element = $$new_props.element);
    		if ('inputElement' in $$new_props) $$invalidate(6, inputElement = $$new_props.inputElement);
    		if ('inputLabelElement' in $$new_props) $$invalidate(7, inputLabelElement = $$new_props.inputLabelElement);
    		if ('subMenuAnchorElement' in $$new_props) $$invalidate(8, subMenuAnchorElement = $$new_props.subMenuAnchorElement);
    		if ('subMenuElement' in $$new_props) $$invalidate(1, subMenuElement = $$new_props.subMenuElement);
    		if ('$$scope' in $$new_props) $$invalidate(43, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		getContext,
    		get_current_component,
    		arrowNavigation,
    		uid,
    		createEventForwarder,
    		tabbable,
    		MenuFlyoutSurface,
    		TextBlock,
    		variant,
    		cascading,
    		hint,
    		selected,
    		checked,
    		indented,
    		group,
    		value,
    		disabled,
    		open,
    		__depth,
    		className,
    		element,
    		inputElement,
    		inputLabelElement,
    		subMenuAnchorElement,
    		subMenuElement,
    		forwardEvents,
    		dispatch,
    		closeFlyout,
    		menuId,
    		menu,
    		subMenuQueue,
    		close,
    		handleKeyDown,
    		handleMouseEnter,
    		handleMouseLeave
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('variant' in $$props) $$invalidate(9, variant = $$new_props.variant);
    		if ('cascading' in $$props) $$invalidate(10, cascading = $$new_props.cascading);
    		if ('hint' in $$props) $$invalidate(11, hint = $$new_props.hint);
    		if ('selected' in $$props) $$invalidate(12, selected = $$new_props.selected);
    		if ('checked' in $$props) $$invalidate(2, checked = $$new_props.checked);
    		if ('indented' in $$props) $$invalidate(13, indented = $$new_props.indented);
    		if ('group' in $$props) $$invalidate(3, group = $$new_props.group);
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('disabled' in $$props) $$invalidate(14, disabled = $$new_props.disabled);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('__depth' in $$props) $$invalidate(15, __depth = $$new_props.__depth);
    		if ('className' in $$props) $$invalidate(16, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(5, element = $$new_props.element);
    		if ('inputElement' in $$props) $$invalidate(6, inputElement = $$new_props.inputElement);
    		if ('inputLabelElement' in $$props) $$invalidate(7, inputLabelElement = $$new_props.inputLabelElement);
    		if ('subMenuAnchorElement' in $$props) $$invalidate(8, subMenuAnchorElement = $$new_props.subMenuAnchorElement);
    		if ('subMenuElement' in $$props) $$invalidate(1, subMenuElement = $$new_props.subMenuElement);
    		if ('menu' in $$props) $$invalidate(17, menu = $$new_props.menu);
    		if ('subMenuQueue' in $$props) subMenuQueue = $$new_props.subMenuQueue;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*open*/ 1) {
    			dispatch(open ? "open" : "close");
    		}

    		if ($$self.$$.dirty[0] & /*open, menu, subMenuElement*/ 131075) {
    			if (open && menu && tabbable(subMenuElement).length > 0) tabbable(subMenuElement)[0].focus();
    		}
    	};

    	return [
    		open,
    		subMenuElement,
    		checked,
    		group,
    		value,
    		element,
    		inputElement,
    		inputLabelElement,
    		subMenuAnchorElement,
    		variant,
    		cascading,
    		hint,
    		selected,
    		indented,
    		disabled,
    		__depth,
    		className,
    		menu,
    		forwardEvents,
    		menuId,
    		close,
    		handleKeyDown,
    		handleMouseEnter,
    		handleMouseLeave,
    		$$slots,
    		$$restProps,
    		slots,
    		change_handler,
    		input_handler,
    		beforeinput_handler,
    		change_handler_1,
    		input_handler_1,
    		beforeinput_handler_1,
    		menuflyoutsurface_element_binding,
    		menuflyoutsurface_binding,
    		div_binding,
    		li_binding,
    		input_change_handler,
    		$$binding_groups,
    		input_binding,
    		input_binding_1,
    		input_change_handler_1,
    		label_binding,
    		$$scope
    	];
    }

    class MenuFlyoutItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$7,
    			create_fragment$7,
    			safe_not_equal,
    			{
    				variant: 9,
    				cascading: 10,
    				hint: 11,
    				selected: 12,
    				checked: 2,
    				indented: 13,
    				group: 3,
    				value: 4,
    				disabled: 14,
    				open: 0,
    				__depth: 15,
    				class: 16,
    				element: 5,
    				inputElement: 6,
    				inputLabelElement: 7,
    				subMenuAnchorElement: 8,
    				subMenuElement: 1
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuFlyoutItem",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get variant() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get cascading() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set cascading(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hint() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hint(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selected() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selected(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get checked() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set checked(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get indented() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set indented(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get __depth() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set __depth(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputElement() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputElement(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get inputLabelElement() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set inputLabelElement(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subMenuAnchorElement() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subMenuAnchorElement(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get subMenuElement() {
    		throw new Error("<MenuFlyoutItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set subMenuElement(value) {
    		throw new Error("<MenuFlyoutItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/MenuFlyout/MenuFlyoutDivider.svelte generated by Svelte v3.59.2 */

    const file$6 = "node_modules/fluent-svelte/MenuFlyout/MenuFlyoutDivider.svelte";

    function create_fragment$6(ctx) {
    	let hr;
    	let hr_class_value;

    	let hr_levels = [
    		{
    			class: hr_class_value = "menu-flyout-divider " + /*className*/ ctx[1]
    		},
    		/*$$restProps*/ ctx[2]
    	];

    	let hr_data = {};

    	for (let i = 0; i < hr_levels.length; i += 1) {
    		hr_data = assign(hr_data, hr_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			set_attributes(hr, hr_data);
    			toggle_class(hr, "svelte-1fs8gxj", true);
    			add_location(hr, file$6, 7, 0, 220);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			/*hr_binding*/ ctx[3](hr);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(hr, hr_data = get_spread_update(hr_levels, [
    				dirty & /*className*/ 2 && hr_class_value !== (hr_class_value = "menu-flyout-divider " + /*className*/ ctx[1]) && { class: hr_class_value },
    				dirty & /*$$restProps*/ 4 && /*$$restProps*/ ctx[2]
    			]));

    			toggle_class(hr, "svelte-1fs8gxj", true);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			/*hr_binding*/ ctx[3](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const omit_props_names = ["class","element"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MenuFlyoutDivider', slots, []);
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;

    	function hr_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('class' in $$new_props) $$invalidate(1, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    	};

    	$$self.$capture_state = () => ({ className, element });

    	$$self.$inject_state = $$new_props => {
    		if ('className' in $$props) $$invalidate(1, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [element, className, $$restProps, hr_binding];
    }

    class MenuFlyoutDivider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { class: 1, element: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuFlyoutDivider",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get class() {
    		throw new Error("<MenuFlyoutDivider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<MenuFlyoutDivider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<MenuFlyoutDivider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<MenuFlyoutDivider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/ContextMenu/ContextMenu.svelte generated by Svelte v3.59.2 */

    const { window: window_1 } = globals;
    const file$5 = "node_modules/fluent-svelte/ContextMenu/ContextMenu.svelte";
    const get_flyout_slot_changes = dirty => ({});
    const get_flyout_slot_context = ctx => ({});

    // (71:1) {#if open}
    function create_if_block$2(ctx) {
    	let div;
    	let menuflyoutsurface;
    	let updating_element;
    	let current;
    	let mounted;
    	let dispose;
    	const menuflyoutsurface_spread_levels = [/*$$restProps*/ ctx[8]];

    	function menuflyoutsurface_element_binding(value) {
    		/*menuflyoutsurface_element_binding*/ ctx[14](value);
    	}

    	let menuflyoutsurface_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < menuflyoutsurface_spread_levels.length; i += 1) {
    		menuflyoutsurface_props = assign(menuflyoutsurface_props, menuflyoutsurface_spread_levels[i]);
    	}

    	if (/*menuElement*/ ctx[2] !== void 0) {
    		menuflyoutsurface_props.element = /*menuElement*/ ctx[2];
    	}

    	menuflyoutsurface = new MenuFlyoutSurface({
    			props: menuflyoutsurface_props,
    			$$inline: true
    		});

    	/*menuflyoutsurface_binding*/ ctx[13](menuflyoutsurface);
    	binding_callbacks.push(() => bind(menuflyoutsurface, 'element', menuflyoutsurface_element_binding));

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(menuflyoutsurface.$$.fragment);
    			attr_dev(div, "class", "context-menu-anchor svelte-s5j1tt");
    			set_style(div, "top", /*menuPosition*/ ctx[5].y + "px");
    			set_style(div, "left", /*menuPosition*/ ctx[5].x + "px");
    			add_location(div, file$5, 71, 2, 2191);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(menuflyoutsurface, div, null);
    			/*div_binding*/ ctx[15](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(mountMenu.call(null, div)),
    					action_destroyer(arrowNavigation.call(null, div, { preventTab: true })),
    					action_destroyer(externalMouseEvents.call(null, div, { type: "mousedown" })),
    					listen_dev(div, "contextmenu", stop_propagation(contextmenu_handler_1), false, false, true, false),
    					listen_dev(div, "outermousedown", /*outermousedown_handler*/ ctx[16], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const menuflyoutsurface_changes = (dirty & /*$$restProps*/ 256)
    			? get_spread_update(menuflyoutsurface_spread_levels, [get_spread_object(/*$$restProps*/ ctx[8])])
    			: {};

    			if (dirty & /*$$scope*/ 262144) {
    				menuflyoutsurface_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_element && dirty & /*menuElement*/ 4) {
    				updating_element = true;
    				menuflyoutsurface_changes.element = /*menuElement*/ ctx[2];
    				add_flush_callback(() => updating_element = false);
    			}

    			menuflyoutsurface.$set(menuflyoutsurface_changes);

    			if (!current || dirty & /*menuPosition*/ 32) {
    				set_style(div, "top", /*menuPosition*/ ctx[5].y + "px");
    			}

    			if (!current || dirty & /*menuPosition*/ 32) {
    				set_style(div, "left", /*menuPosition*/ ctx[5].x + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuflyoutsurface.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuflyoutsurface.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*menuflyoutsurface_binding*/ ctx[13](null);
    			destroy_component(menuflyoutsurface);
    			/*div_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(71:1) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (82:3) <MenuFlyoutSurface bind:this={menu} bind:element={menuElement} {...$$restProps}>
    function create_default_slot$3(ctx) {
    	let current;
    	const flyout_slot_template = /*#slots*/ ctx[11].flyout;
    	const flyout_slot = create_slot(flyout_slot_template, ctx, /*$$scope*/ ctx[18], get_flyout_slot_context);

    	const block = {
    		c: function create() {
    			if (flyout_slot) flyout_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (flyout_slot) {
    				flyout_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (flyout_slot) {
    				if (flyout_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						flyout_slot,
    						flyout_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(flyout_slot_template, /*$$scope*/ ctx[18], dirty, get_flyout_slot_changes),
    						get_flyout_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (flyout_slot) flyout_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(82:3) <MenuFlyoutSurface bind:this={menu} bind:element={menuElement} {...$$restProps}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let t;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], null);
    	let if_block = /*open*/ ctx[0] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "context-menu-wrapper svelte-s5j1tt");
    			add_location(div, file$5, 63, 0, 2019);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t);
    			if (if_block) if_block.m(div, null);
    			/*div_binding_1*/ ctx[17](div);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window_1, "keydown", /*handleEscapeKey*/ ctx[7], false, false, false, false),
    					listen_dev(div, "contextmenu", stop_propagation(prevent_default(/*handleContextMenu*/ ctx[6])), false, true, true, false),
    					listen_dev(div, "contextmenu", /*contextmenu_handler*/ ctx[12], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 262144)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*open*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*open*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (if_block) if_block.d();
    			/*div_binding_1*/ ctx[17](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function mountMenu(node) {
    	document.body.appendChild(node);
    	return { destroy: () => node.remove() };
    }

    const contextmenu_handler_1 = e => e.preventDefault();

    function instance$5($$self, $$props, $$invalidate) {
    	const omit_props_names = ["closeOnSelect","open","wrapperElement","anchorElement","menuElement"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ContextMenu', slots, ['default','flyout']);
    	let { closeOnSelect = true } = $$props;
    	let { open = false } = $$props;
    	let { wrapperElement = null } = $$props;
    	let { anchorElement = null } = $$props;
    	let { menuElement = null } = $$props;
    	const dispatch = createEventDispatcher();
    	let menu;
    	let menuPosition = { x: 0, y: 0 };
    	let mousePosition = { x: 0, y: 0 };

    	async function handleContextMenu({ clientX, clientY }) {
    		$$invalidate(0, open = true);
    		$$invalidate(10, mousePosition = { x: clientX, y: clientY });
    	}

    	function handleEscapeKey({ key }) {
    		if (key === "Escape") $$invalidate(0, open = false);
    	}

    	setContext("closeFlyout", event => {
    		dispatch("select");
    		if (closeOnSelect) $$invalidate(0, open = false);
    	});

    	function contextmenu_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function menuflyoutsurface_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			menu = $$value;
    			$$invalidate(4, menu);
    		});
    	}

    	function menuflyoutsurface_element_binding(value) {
    		menuElement = value;
    		$$invalidate(2, menuElement);
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			anchorElement = $$value;
    			$$invalidate(1, anchorElement);
    		});
    	}

    	const outermousedown_handler = () => $$invalidate(0, open = false);

    	function div_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			wrapperElement = $$value;
    			$$invalidate(3, wrapperElement);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(8, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('closeOnSelect' in $$new_props) $$invalidate(9, closeOnSelect = $$new_props.closeOnSelect);
    		if ('open' in $$new_props) $$invalidate(0, open = $$new_props.open);
    		if ('wrapperElement' in $$new_props) $$invalidate(3, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$new_props) $$invalidate(1, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$new_props) $$invalidate(2, menuElement = $$new_props.menuElement);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		setContext,
    		externalMouseEvents,
    		arrowNavigation,
    		tabbable,
    		MenuFlyoutSurface,
    		closeOnSelect,
    		open,
    		wrapperElement,
    		anchorElement,
    		menuElement,
    		dispatch,
    		menu,
    		menuPosition,
    		mousePosition,
    		handleContextMenu,
    		handleEscapeKey,
    		mountMenu
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('closeOnSelect' in $$props) $$invalidate(9, closeOnSelect = $$new_props.closeOnSelect);
    		if ('open' in $$props) $$invalidate(0, open = $$new_props.open);
    		if ('wrapperElement' in $$props) $$invalidate(3, wrapperElement = $$new_props.wrapperElement);
    		if ('anchorElement' in $$props) $$invalidate(1, anchorElement = $$new_props.anchorElement);
    		if ('menuElement' in $$props) $$invalidate(2, menuElement = $$new_props.menuElement);
    		if ('menu' in $$props) $$invalidate(4, menu = $$new_props.menu);
    		if ('menuPosition' in $$props) $$invalidate(5, menuPosition = $$new_props.menuPosition);
    		if ('mousePosition' in $$props) $$invalidate(10, mousePosition = $$new_props.mousePosition);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 1) {
    			dispatch(open ? "open" : "close");
    		}

    		if ($$self.$$.dirty & /*menu, menuElement*/ 20) {
    			if (menu && tabbable(menuElement).length > 0) tabbable(menuElement)[0].focus();
    		}

    		if ($$self.$$.dirty & /*anchorElement, mousePosition, menuPosition*/ 1058) {
    			if (anchorElement) {
    				const { width, height } = anchorElement.getBoundingClientRect();
    				$$invalidate(5, menuPosition.x = Math.min(window.innerWidth - width, mousePosition.x), menuPosition);

    				$$invalidate(
    					5,
    					menuPosition.y = mousePosition.y > window.innerHeight - height
    					? $$invalidate(10, mousePosition.y -= height, mousePosition)
    					: mousePosition.y,
    					menuPosition
    				);

    				if (menuPosition.y < 0) $$invalidate(5, menuPosition.y = 0, menuPosition);
    			}
    		}
    	};

    	return [
    		open,
    		anchorElement,
    		menuElement,
    		wrapperElement,
    		menu,
    		menuPosition,
    		handleContextMenu,
    		handleEscapeKey,
    		$$restProps,
    		closeOnSelect,
    		mousePosition,
    		slots,
    		contextmenu_handler,
    		menuflyoutsurface_binding,
    		menuflyoutsurface_element_binding,
    		div_binding,
    		outermousedown_handler,
    		div_binding_1,
    		$$scope
    	];
    }

    class ContextMenu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			closeOnSelect: 9,
    			open: 0,
    			wrapperElement: 3,
    			anchorElement: 1,
    			menuElement: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ContextMenu",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get closeOnSelect() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closeOnSelect(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get wrapperElement() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set wrapperElement(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get anchorElement() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set anchorElement(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuElement() {
    		throw new Error("<ContextMenu>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuElement(value) {
    		throw new Error("<ContextMenu>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/CalendarView/CalendarView.svelte generated by Svelte v3.59.2 */
    const file$4 = "node_modules/fluent-svelte/CalendarView/CalendarView.svelte";

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[51] = i;
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[56] = list[i];
    	child_ctx[49] = i;

    	const constants_0 = /*value*/ child_ctx[0] !== null && (Array.isArray(/*value*/ child_ctx[0])
    	? indexOfDate(/*value*/ child_ctx[0], /*year*/ child_ctx[56], "year") > -1
    	: compareDates(/*value*/ child_ctx[0], /*year*/ child_ctx[56], "year"));

    	child_ctx[45] = constants_0;
    	const constants_1 = compareDates(/*year*/ child_ctx[56], /*page*/ child_ctx[11], "decade");
    	child_ctx[57] = constants_1;
    	const constants_2 = getCalendarYears(/*page*/ child_ctx[11]).find(d => compareDates(d, /*page*/ child_ctx[11], "decade") && (!/*min*/ child_ctx[6] || /*min*/ child_ctx[6].getFullYear() <= d.getFullYear()) && (!/*max*/ child_ctx[7] || /*max*/ child_ctx[7] >= d));
    	child_ctx[58] = constants_2;
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[52] = list[i];
    	child_ctx[49] = i;

    	const constants_0 = /*value*/ child_ctx[0] !== null && (Array.isArray(/*value*/ child_ctx[0])
    	? indexOfDate(/*value*/ child_ctx[0], /*month*/ child_ctx[52], "month") > -1
    	: compareDates(/*value*/ child_ctx[0], /*month*/ child_ctx[52], "month"));

    	child_ctx[45] = constants_0;
    	const constants_1 = /*month*/ child_ctx[52].getFullYear() === /*page*/ child_ctx[11].getFullYear();
    	child_ctx[53] = constants_1;
    	const constants_2 = getCalendarMonths(/*page*/ child_ctx[11]).find(d => compareDates(d, /*page*/ child_ctx[11], "year") && (!/*min*/ child_ctx[6] || new Date(/*min*/ child_ctx[6].getFullYear(), /*min*/ child_ctx[6].getMonth(), 1) <= new Date(d.getFullYear(), d.getMonth(), 1)) && (!/*max*/ child_ctx[7] || /*max*/ child_ctx[7] >= d));
    	child_ctx[54] = constants_2;
    	return child_ctx;
    }

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[43] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[44] = list[i];
    	child_ctx[49] = i;

    	const constants_0 = /*value*/ child_ctx[0] !== null && (Array.isArray(/*value*/ child_ctx[0])
    	? indexOfDate(/*value*/ child_ctx[0], /*day*/ child_ctx[44], "day") > -1
    	: compareDates(/*value*/ child_ctx[0], /*day*/ child_ctx[44], "day"));

    	child_ctx[45] = constants_0;
    	const constants_1 = compareDates(/*day*/ child_ctx[44], /*page*/ child_ctx[11], "month");
    	child_ctx[46] = constants_1;
    	const constants_2 = /*getCalendarDays*/ child_ctx[19](/*page*/ child_ctx[11]).find(d => compareDates(d, /*page*/ child_ctx[11], "month") && (!/*blackout*/ child_ctx[5] || indexOfDate(/*blackout*/ child_ctx[5], d, "day") === -1) && (!/*min*/ child_ctx[6] || /*min*/ child_ctx[6] <= d) && (!/*max*/ child_ctx[7] || /*max*/ child_ctx[7] >= d));
    	child_ctx[47] = constants_2;
    	return child_ctx;
    }

    function get_each_context_5(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	child_ctx[44] = i;
    	return child_ctx;
    }

    // (423:4) {#if view === "days"}
    function create_if_block_3(ctx) {
    	let thead;
    	let tr;
    	let each_value_5 = Array(7);
    	validate_each_argument(each_value_5);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_5.length; i += 1) {
    		each_blocks[i] = create_each_block_5(get_each_context_5(ctx, each_value_5, i));
    	}

    	const block = {
    		c: function create() {
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(tr, "class", "svelte-2np5h6");
    			add_location(tr, file$4, 424, 6, 16581);
    			attr_dev(thead, "class", "svelte-2np5h6");
    			add_location(thead, file$4, 423, 5, 16567);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, thead, anchor);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tr, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*locale, weekStart*/ 264) {
    				each_value_5 = Array(7);
    				validate_each_argument(each_value_5);
    				let i;

    				for (i = 0; i < each_value_5.length; i += 1) {
    					const child_ctx = get_each_context_5(ctx, each_value_5, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_5(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tr, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_5.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(thead);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(423:4) {#if view === \\\"days\\\"}",
    		ctx
    	});

    	return block;
    }

    // (426:7) {#each Array(7) as _, day}
    function create_each_block_5(ctx) {
    	let th;

    	let t0_value = getWeekdayLocale(/*day*/ ctx[44], {
    		locale: /*locale*/ ctx[3],
    		format: "short",
    		offset: /*weekStart*/ ctx[8]
    	}) + "";

    	let t0;
    	let t1;

    	let th_levels = [
    		{ scope: "col" },
    		{
    			abbr: getWeekdayLocale(/*day*/ ctx[44], {
    				locale: /*locale*/ ctx[3],
    				offset: /*weekStart*/ ctx[8]
    			})
    		}
    	];

    	let th_data = {};

    	for (let i = 0; i < th_levels.length; i += 1) {
    		th_data = assign(th_data, th_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			set_attributes(th, th_data);
    			toggle_class(th, "svelte-2np5h6", true);
    			add_location(th, file$4, 426, 8, 16628);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*locale, weekStart*/ 264 && t0_value !== (t0_value = getWeekdayLocale(/*day*/ ctx[44], {
    				locale: /*locale*/ ctx[3],
    				format: "short",
    				offset: /*weekStart*/ ctx[8]
    			}) + "")) set_data_maybe_contenteditable_dev(t0, t0_value, th_data['contenteditable']);

    			set_attributes(th, th_data = get_spread_update(th_levels, [
    				{ scope: "col" },
    				dirty[0] & /*locale, weekStart*/ 264 && {
    					abbr: getWeekdayLocale(/*day*/ ctx[44], {
    						locale: /*locale*/ ctx[3],
    						offset: /*weekStart*/ ctx[8]
    					})
    				}
    			]));

    			toggle_class(th, "svelte-2np5h6", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_5.name,
    		type: "each",
    		source: "(426:7) {#each Array(7) as _, day}",
    		ctx
    	});

    	return block;
    }

    // (516:6) {:else}
    function create_else_block(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_2 = Array(4);
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page, min, max, headers, value, selectMonth, handleKeyDown, locale, view, selectYear*/ 54528219) {
    				each_value_2 = Array(4);
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_2.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(516:6) {:else}",
    		ctx
    	});

    	return block;
    }

    // (469:6) {#if view === "days"}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = Array(6);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getCalendarDays, page, min, max, blackout, headers, locale, value, selectDay, handleKeyDown*/ 13109497) {
    				each_value = Array(6);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(469:6) {#if view === \\\"days\\\"}",
    		ctx
    	});

    	return block;
    }

    // (583:36) 
    function create_if_block_2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_4 = getCalendarYears(/*page*/ ctx[11]).slice(/*row*/ ctx[51] * 4, /*row*/ ctx[51] * 4 + 4);
    	validate_each_argument(each_value_4);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page, min, max, value, selectYear, handleKeyDown*/ 37750977) {
    				each_value_4 = getCalendarYears(/*page*/ ctx[11]).slice(/*row*/ ctx[51] * 4, /*row*/ ctx[51] * 4 + 4);
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_4(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(583:36) ",
    		ctx
    	});

    	return block;
    }

    // (519:9) {#if view === "months"}
    function create_if_block_1$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value_3 = getCalendarMonths(/*page*/ ctx[11]).slice(/*row*/ ctx[51] * 4, /*row*/ ctx[51] * 4 + 4);
    	validate_each_argument(each_value_3);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page, min, max, headers, value, selectMonth, handleKeyDown, locale*/ 20973785) {
    				each_value_3 = getCalendarMonths(/*page*/ ctx[11]).slice(/*row*/ ctx[51] * 4, /*row*/ ctx[51] * 4 + 4);
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(519:9) {#if view === \\\"months\\\"}",
    		ctx
    	});

    	return block;
    }

    // (602:12) <CalendarViewItem              on:click={() => selectYear(year)}              on:keydown={e => handleKeyDown(e, year)}              variant="monthYear"              outOfRange={!inDecade}              current={compareDates(year, new Date(), "year")}              disabled={min?.getFullYear() >               year.getFullYear() || max < year}              {selected}              tabindex={firstFocusableYear &&              compareDates(firstFocusableYear, year, "year")               ? 0               : -1}             >
    function create_default_slot_2$1(ctx) {
    	let t_value = /*year*/ ctx[56].getFullYear() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page*/ 2048 && t_value !== (t_value = /*year*/ ctx[56].getFullYear() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(602:12) <CalendarViewItem              on:click={() => selectYear(year)}              on:keydown={e => handleKeyDown(e, year)}              variant=\\\"monthYear\\\"              outOfRange={!inDecade}              current={compareDates(year, new Date(), \\\"year\\\")}              disabled={min?.getFullYear() >               year.getFullYear() || max < year}              {selected}              tabindex={firstFocusableYear &&              compareDates(firstFocusableYear, year, \\\"year\\\")               ? 0               : -1}             >",
    		ctx
    	});

    	return block;
    }

    // (584:10) {#each getCalendarYears(page).slice(row * 4, row * 4 + 4) as year, i}
    function create_each_block_4(ctx) {
    	let td;
    	let calendarviewitem;
    	let t;
    	let current;

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[35](/*year*/ ctx[56]);
    	}

    	function keydown_handler_2(...args) {
    		return /*keydown_handler_2*/ ctx[36](/*year*/ ctx[56], ...args);
    	}

    	calendarviewitem = new CalendarViewItem({
    			props: {
    				variant: "monthYear",
    				outOfRange: !/*inDecade*/ ctx[57],
    				current: compareDates(/*year*/ ctx[56], new Date(), "year"),
    				disabled: /*min*/ ctx[6]?.getFullYear() > /*year*/ ctx[56].getFullYear() || /*max*/ ctx[7] < /*year*/ ctx[56],
    				selected: /*selected*/ ctx[45],
    				tabindex: /*firstFocusableYear*/ ctx[58] && compareDates(/*firstFocusableYear*/ ctx[58], /*year*/ ctx[56], "year")
    				? 0
    				: -1,
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	calendarviewitem.$on("click", click_handler_5);
    	calendarviewitem.$on("keydown", keydown_handler_2);

    	const block = {
    		c: function create() {
    			td = element("td");
    			create_component(calendarviewitem.$$.fragment);
    			t = space();
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-2np5h6");
    			add_location(td, file$4, 600, 11, 21790);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			mount_component(calendarviewitem, td, null);
    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const calendarviewitem_changes = {};
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.outOfRange = !/*inDecade*/ ctx[57];
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.current = compareDates(/*year*/ ctx[56], new Date(), "year");
    			if (dirty[0] & /*min, page, max*/ 2240) calendarviewitem_changes.disabled = /*min*/ ctx[6]?.getFullYear() > /*year*/ ctx[56].getFullYear() || /*max*/ ctx[7] < /*year*/ ctx[56];
    			if (dirty[0] & /*value, page*/ 2049) calendarviewitem_changes.selected = /*selected*/ ctx[45];

    			if (dirty[0] & /*page, min, max*/ 2240) calendarviewitem_changes.tabindex = /*firstFocusableYear*/ ctx[58] && compareDates(/*firstFocusableYear*/ ctx[58], /*year*/ ctx[56], "year")
    			? 0
    			: -1;

    			if (dirty[0] & /*page*/ 2048 | dirty[1] & /*$$scope*/ 1073741824) {
    				calendarviewitem_changes.$$scope = { dirty, ctx };
    			}

    			calendarviewitem.$set(calendarviewitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarviewitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarviewitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_component(calendarviewitem);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(584:10) {#each getCalendarYears(page).slice(row * 4, row * 4 + 4) as year, i}",
    		ctx
    	});

    	return block;
    }

    // (548:12) <CalendarViewItem              on:click={() => selectMonth(month)}              on:keydown={e => handleKeyDown(e, month)}              variant="monthYear"              outOfRange={!inYear}              current={compareDates(               month,               new Date(),               "month"              )}              disabled={(min?.getMonth() > month.getMonth() &&               min?.getFullYear() ===                month.getFullYear()) ||               max < month}              header={page &&               headers &&               month.getMonth() === 0 &&               month.getFullYear().toString()}              {selected}              tabindex={firstFocusableMonth &&              compareDates(               firstFocusableMonth,               month,               "month"              )               ? 0               : -1}             >
    function create_default_slot_1$2(ctx) {
    	let t_value = getMonthLocale(/*month*/ ctx[52].getMonth(), {
    		locale: /*locale*/ ctx[3],
    		format: "short"
    	}) + "";

    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page, locale*/ 2056 && t_value !== (t_value = getMonthLocale(/*month*/ ctx[52].getMonth(), {
    				locale: /*locale*/ ctx[3],
    				format: "short"
    			}) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(548:12) <CalendarViewItem              on:click={() => selectMonth(month)}              on:keydown={e => handleKeyDown(e, month)}              variant=\\\"monthYear\\\"              outOfRange={!inYear}              current={compareDates(               month,               new Date(),               \\\"month\\\"              )}              disabled={(min?.getMonth() > month.getMonth() &&               min?.getFullYear() ===                month.getFullYear()) ||               max < month}              header={page &&               headers &&               month.getMonth() === 0 &&               month.getFullYear().toString()}              {selected}              tabindex={firstFocusableMonth &&              compareDates(               firstFocusableMonth,               month,               \\\"month\\\"              )               ? 0               : -1}             >",
    		ctx
    	});

    	return block;
    }

    // (520:10) {#each getCalendarMonths(page).slice(row * 4, row * 4 + 4) as month, i}
    function create_each_block_3(ctx) {
    	let td;
    	let calendarviewitem;
    	let t;
    	let current;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[33](/*month*/ ctx[52]);
    	}

    	function keydown_handler_1(...args) {
    		return /*keydown_handler_1*/ ctx[34](/*month*/ ctx[52], ...args);
    	}

    	calendarviewitem = new CalendarViewItem({
    			props: {
    				variant: "monthYear",
    				outOfRange: !/*inYear*/ ctx[53],
    				current: compareDates(/*month*/ ctx[52], new Date(), "month"),
    				disabled: /*min*/ ctx[6]?.getMonth() > /*month*/ ctx[52].getMonth() && /*min*/ ctx[6]?.getFullYear() === /*month*/ ctx[52].getFullYear() || /*max*/ ctx[7] < /*month*/ ctx[52],
    				header: /*page*/ ctx[11] && /*headers*/ ctx[4] && /*month*/ ctx[52].getMonth() === 0 && /*month*/ ctx[52].getFullYear().toString(),
    				selected: /*selected*/ ctx[45],
    				tabindex: /*firstFocusableMonth*/ ctx[54] && compareDates(/*firstFocusableMonth*/ ctx[54], /*month*/ ctx[52], "month")
    				? 0
    				: -1,
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	calendarviewitem.$on("click", click_handler_4);
    	calendarviewitem.$on("keydown", keydown_handler_1);

    	const block = {
    		c: function create() {
    			td = element("td");
    			create_component(calendarviewitem.$$.fragment);
    			t = space();
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-2np5h6");
    			add_location(td, file$4, 546, 11, 20040);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			mount_component(calendarviewitem, td, null);
    			append_dev(td, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const calendarviewitem_changes = {};
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.outOfRange = !/*inYear*/ ctx[53];
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.current = compareDates(/*month*/ ctx[52], new Date(), "month");
    			if (dirty[0] & /*min, page, max*/ 2240) calendarviewitem_changes.disabled = /*min*/ ctx[6]?.getMonth() > /*month*/ ctx[52].getMonth() && /*min*/ ctx[6]?.getFullYear() === /*month*/ ctx[52].getFullYear() || /*max*/ ctx[7] < /*month*/ ctx[52];
    			if (dirty[0] & /*page, headers*/ 2064) calendarviewitem_changes.header = /*page*/ ctx[11] && /*headers*/ ctx[4] && /*month*/ ctx[52].getMonth() === 0 && /*month*/ ctx[52].getFullYear().toString();
    			if (dirty[0] & /*value, page*/ 2049) calendarviewitem_changes.selected = /*selected*/ ctx[45];

    			if (dirty[0] & /*page, min, max*/ 2240) calendarviewitem_changes.tabindex = /*firstFocusableMonth*/ ctx[54] && compareDates(/*firstFocusableMonth*/ ctx[54], /*month*/ ctx[52], "month")
    			? 0
    			: -1;

    			if (dirty[0] & /*page, locale*/ 2056 | dirty[1] & /*$$scope*/ 1073741824) {
    				calendarviewitem_changes.$$scope = { dirty, ctx };
    			}

    			calendarviewitem.$set(calendarviewitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarviewitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarviewitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_component(calendarviewitem);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(520:10) {#each getCalendarMonths(page).slice(row * 4, row * 4 + 4) as month, i}",
    		ctx
    	});

    	return block;
    }

    // (517:7) {#each Array(4) as _, row}
    function create_each_block_2(ctx) {
    	let tr;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let current;
    	const if_block_creators = [create_if_block_1$1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*view*/ ctx[1] === "months") return 0;
    		if (/*view*/ ctx[1] === "years") return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			if (if_block) if_block.c();
    			t = space();
    			attr_dev(tr, "class", "svelte-2np5h6");
    			add_location(tr, file$4, 517, 8, 19143);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(tr, null);
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(tr, t);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(517:7) {#each Array(4) as _, row}",
    		ctx
    	});

    	return block;
    }

    // (489:11) <CalendarViewItem             on:click={() => selectDay(day)}             on:keydown={e => handleKeyDown(e, day)}             outOfRange={!inMonth}             current={compareDates(day, new Date(), "day")}             disabled={min > day || max < day}             blackout={blackout &&              indexOfDate(blackout, day, "day") > -1}             header={page &&              headers &&              day.getDate() === 1 &&              getMonthLocale(day.getMonth(), {               locale,               format: "short"              })}             tabindex={firstFocusableDay &&             compareDates(firstFocusableDay, day, "day")              ? 0              : -1}             {selected}            >
    function create_default_slot$2(ctx) {
    	let t_value = /*day*/ ctx[44].getDate() + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*page*/ 2048 && t_value !== (t_value = /*day*/ ctx[44].getDate() + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(489:11) <CalendarViewItem             on:click={() => selectDay(day)}             on:keydown={e => handleKeyDown(e, day)}             outOfRange={!inMonth}             current={compareDates(day, new Date(), \\\"day\\\")}             disabled={min > day || max < day}             blackout={blackout &&              indexOfDate(blackout, day, \\\"day\\\") > -1}             header={page &&              headers &&              day.getDate() === 1 &&              getMonthLocale(day.getMonth(), {               locale,               format: \\\"short\\\"              })}             tabindex={firstFocusableDay &&             compareDates(firstFocusableDay, day, \\\"day\\\")              ? 0              : -1}             {selected}            >",
    		ctx
    	});

    	return block;
    }

    // (472:9) {#each getCalendarDays(page).slice(week * 7, week * 7 + 7) as day, i}
    function create_each_block_1(ctx) {
    	let td;
    	let calendarviewitem;
    	let current;

    	function click_handler_3() {
    		return /*click_handler_3*/ ctx[31](/*day*/ ctx[44]);
    	}

    	function keydown_handler(...args) {
    		return /*keydown_handler*/ ctx[32](/*day*/ ctx[44], ...args);
    	}

    	calendarviewitem = new CalendarViewItem({
    			props: {
    				outOfRange: !/*inMonth*/ ctx[46],
    				current: compareDates(/*day*/ ctx[44], new Date(), "day"),
    				disabled: /*min*/ ctx[6] > /*day*/ ctx[44] || /*max*/ ctx[7] < /*day*/ ctx[44],
    				blackout: /*blackout*/ ctx[5] && indexOfDate(/*blackout*/ ctx[5], /*day*/ ctx[44], "day") > -1,
    				header: /*page*/ ctx[11] && /*headers*/ ctx[4] && /*day*/ ctx[44].getDate() === 1 && getMonthLocale(/*day*/ ctx[44].getMonth(), {
    					locale: /*locale*/ ctx[3],
    					format: "short"
    				}),
    				tabindex: /*firstFocusableDay*/ ctx[47] && compareDates(/*firstFocusableDay*/ ctx[47], /*day*/ ctx[44], "day")
    				? 0
    				: -1,
    				selected: /*selected*/ ctx[45],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	calendarviewitem.$on("click", click_handler_3);
    	calendarviewitem.$on("keydown", keydown_handler);

    	const block = {
    		c: function create() {
    			td = element("td");
    			create_component(calendarviewitem.$$.fragment);
    			attr_dev(td, "role", "gridcell");
    			attr_dev(td, "class", "svelte-2np5h6");
    			add_location(td, file$4, 487, 10, 18220);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			mount_component(calendarviewitem, td, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const calendarviewitem_changes = {};
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.outOfRange = !/*inMonth*/ ctx[46];
    			if (dirty[0] & /*page*/ 2048) calendarviewitem_changes.current = compareDates(/*day*/ ctx[44], new Date(), "day");
    			if (dirty[0] & /*min, page, max*/ 2240) calendarviewitem_changes.disabled = /*min*/ ctx[6] > /*day*/ ctx[44] || /*max*/ ctx[7] < /*day*/ ctx[44];
    			if (dirty[0] & /*blackout, page*/ 2080) calendarviewitem_changes.blackout = /*blackout*/ ctx[5] && indexOfDate(/*blackout*/ ctx[5], /*day*/ ctx[44], "day") > -1;

    			if (dirty[0] & /*page, headers, locale*/ 2072) calendarviewitem_changes.header = /*page*/ ctx[11] && /*headers*/ ctx[4] && /*day*/ ctx[44].getDate() === 1 && getMonthLocale(/*day*/ ctx[44].getMonth(), {
    				locale: /*locale*/ ctx[3],
    				format: "short"
    			});

    			if (dirty[0] & /*page, blackout, min, max*/ 2272) calendarviewitem_changes.tabindex = /*firstFocusableDay*/ ctx[47] && compareDates(/*firstFocusableDay*/ ctx[47], /*day*/ ctx[44], "day")
    			? 0
    			: -1;

    			if (dirty[0] & /*value, page*/ 2049) calendarviewitem_changes.selected = /*selected*/ ctx[45];

    			if (dirty[0] & /*page*/ 2048 | dirty[1] & /*$$scope*/ 1073741824) {
    				calendarviewitem_changes.$$scope = { dirty, ctx };
    			}

    			calendarviewitem.$set(calendarviewitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarviewitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarviewitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    			destroy_component(calendarviewitem);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(472:9) {#each getCalendarDays(page).slice(week * 7, week * 7 + 7) as day, i}",
    		ctx
    	});

    	return block;
    }

    // (470:7) {#each Array(6) as _, week}
    function create_each_block$1(ctx) {
    	let tr;
    	let t;
    	let current;
    	let each_value_1 = /*getCalendarDays*/ ctx[19](/*page*/ ctx[11]).slice(/*week*/ ctx[43] * 7, /*week*/ ctx[43] * 7 + 7);
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(tr, "class", "svelte-2np5h6");
    			add_location(tr, file$4, 470, 8, 17586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(tr, null);
    				}
    			}

    			append_dev(tr, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*getCalendarDays, page, min, max, blackout, headers, locale, value, selectDay, handleKeyDown*/ 13109497) {
    				each_value_1 = /*getCalendarDays*/ ctx[19](/*page*/ ctx[11]).slice(/*week*/ ctx[43] * 7, /*week*/ ctx[43] * 7 + 7);
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(tr, t);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(470:7) {#each Array(6) as _, week}",
    		ctx
    	});

    	return block;
    }

    // (443:4) {#key page}
    function create_key_block_1(ctx) {
    	let tbody;
    	let current_block_type_index;
    	let if_block;
    	let tbody_intro;
    	let tbody_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*view*/ ctx[1] === "days") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			tbody = element("tbody");
    			if_block.c();
    			attr_dev(tbody, "class", "svelte-2np5h6");
    			add_location(tbody, file$4, 443, 5, 16965);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tbody, anchor);
    			if_blocks[current_block_type_index].m(tbody, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(/*bodyElementBinding*/ ctx[18].call(null, tbody));
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(tbody, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (tbody_outro) tbody_outro.end(1);

    				tbody_intro = create_in_transition(tbody, fly, {
    					opacity: 1,
    					duration: /*pageAnimationDuration*/ ctx[15],
    					easing: circOut,
    					y: /*pageAnimationDirection*/ ctx[14] === "neutral"
    					? 0
    					: /*pageAnimationDirection*/ ctx[14] === "up" ? -198 : 198
    				});

    				tbody_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (tbody_intro) tbody_intro.invalidate();

    			if (local) {
    				tbody_outro = create_out_transition(tbody, fly, {
    					opacity: 1,
    					duration: /*pageAnimationDuration*/ ctx[15],
    					easing: circOut,
    					y: /*pageAnimationDirection*/ ctx[14] === "neutral"
    					? 0
    					: /*pageAnimationDirection*/ ctx[14] === "up" ? 198 : -198
    				});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tbody);
    			if_blocks[current_block_type_index].d();
    			if (detaching && tbody_outro) tbody_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block_1.name,
    		type: "key",
    		source: "(443:4) {#key page}",
    		ctx
    	});

    	return block;
    }

    // (406:2) {#key view}
    function create_key_block(ctx) {
    	let table;
    	let t;
    	let previous_key = /*page*/ ctx[11];
    	let table_class_value;
    	let table_intro;
    	let table_outro;
    	let current;
    	let if_block = /*view*/ ctx[1] === "days" && create_if_block_3(ctx);
    	let key_block = create_key_block_1(ctx);

    	const block = {
    		c: function create() {
    			table = element("table");
    			if (if_block) if_block.c();
    			t = space();
    			key_block.c();
    			attr_dev(table, "class", table_class_value = "calendar-view-table view-" + /*view*/ ctx[1] + " svelte-2np5h6");
    			attr_dev(table, "role", "grid");
    			add_location(table, file$4, 406, 3, 16034);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, table, anchor);
    			if (if_block) if_block.m(table, null);
    			append_dev(table, t);
    			key_block.m(table, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*view*/ ctx[1] === "days") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					if_block.m(table, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*page*/ 2048 && safe_not_equal(previous_key, previous_key = /*page*/ ctx[11])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block_1(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(table, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (!current || dirty[0] & /*view*/ 2 && table_class_value !== (table_class_value = "calendar-view-table view-" + /*view*/ ctx[1] + " svelte-2np5h6")) {
    				attr_dev(table, "class", table_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);

    			add_render_callback(() => {
    				if (!current) return;
    				if (table_outro) table_outro.end(1);

    				table_intro = create_in_transition(table, fadeScale, {
    					duration: /*viewAnimationDirection*/ ctx[13] !== "neutral"
    					? 500
    					: 0,
    					easing: circOut,
    					baseScale: /*viewAnimationDirection*/ ctx[13] === "up"
    					? 1.29
    					: 0.84,
    					delay: /*viewAnimationDirection*/ ctx[13] !== "neutral"
    					? 150
    					: 0
    				});

    				table_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			if (table_intro) table_intro.invalidate();

    			if (local) {
    				table_outro = create_out_transition(table, fadeScale, {
    					duration: /*viewAnimationDirection*/ ctx[13] !== "neutral"
    					? 150
    					: 0,
    					easing: circOut,
    					baseScale: /*viewAnimationDirection*/ ctx[13] === "up"
    					? 0.84
    					: 1.29,
    					delay: 0
    				});
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(table);
    			if (if_block) if_block.d();
    			key_block.d(detaching);
    			if (detaching && table_outro) table_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(406:2) {#key view}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div3;
    	let header_1;
    	let div0;
    	let button0;
    	let t0;
    	let button0_disabled_value;
    	let t1;
    	let div1;
    	let button1;
    	let svg0;
    	let path0;
    	let button1_disabled_value;
    	let t2;
    	let button2;
    	let svg1;
    	let path1;
    	let button2_disabled_value;
    	let t3;
    	let div2;
    	let previous_key = /*view*/ ctx[1];
    	let div3_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let key_block = create_key_block(ctx);

    	let div3_levels = [
    		{
    			class: div3_class_value = "calendar-view " + /*className*/ ctx[10]
    		},
    		/*$$restProps*/ ctx[26]
    	];

    	let div_data_3 = {};

    	for (let i = 0; i < div3_levels.length; i += 1) {
    		div_data_3 = assign(div_data_3, div3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			header_1 = element("header");
    			div0 = element("div");
    			button0 = element("button");
    			t0 = text(/*header*/ ctx[12]);
    			t1 = space();
    			div1 = element("div");
    			button1 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t2 = space();
    			button2 = element("button");
    			svg1 = svg_element("svg");
    			path1 = svg_element("path");
    			t3 = space();
    			div2 = element("div");
    			key_block.c();
    			button0.disabled = button0_disabled_value = /*view*/ ctx[1] === "years";
    			attr_dev(button0, "class", "svelte-2np5h6");
    			add_location(button0, file$4, 382, 3, 14968);
    			attr_dev(div0, "class", "calendar-view-header-text svelte-2np5h6");
    			attr_dev(div0, "role", "heading");
    			attr_dev(div0, "aria-live", "polite");
    			add_location(div0, file$4, 381, 2, 14891);
    			attr_dev(path0, "d", "M4.95681 10.998C4.14912 10.998 3.67466 10.09 4.13591 9.42698L6.76854 5.64257C7.36532 4.78469 8.63448 4.7847 9.23126 5.64257L11.8639 9.42698C12.3251 10.09 11.8507 10.998 11.043 10.998H4.95681Z");
    			add_location(path0, file$4, 390, 5, 15327);
    			attr_dev(svg0, "width", "16");
    			attr_dev(svg0, "height", "16");
    			attr_dev(svg0, "viewBox", "0 0 16 16");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "class", "svelte-2np5h6");
    			add_location(svg0, file$4, 389, 4, 15238);
    			button1.disabled = button1_disabled_value = /*view*/ ctx[1] && /*min*/ ctx[6] >= /*page*/ ctx[11];
    			attr_dev(button1, "class", "svelte-2np5h6");
    			add_location(button1, file$4, 388, 3, 15162);
    			attr_dev(path1, "d", "M4.95681 5C4.14912 5 3.67466 5.90803 4.13591 6.57107L6.76854 10.3555C7.36532 11.2134 8.63448 11.2133 9.23126 10.3555L11.8639 6.57106C12.3251 5.90803 11.8507 5 11.043 5H4.95681Z");
    			add_location(path1, file$4, 397, 5, 15729);
    			attr_dev(svg1, "width", "16");
    			attr_dev(svg1, "height", "16");
    			attr_dev(svg1, "viewBox", "0 0 16 16");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "class", "svelte-2np5h6");
    			add_location(svg1, file$4, 396, 4, 15640);
    			button2.disabled = button2_disabled_value = /*max*/ ctx[7] < /*nextPage*/ ctx[16];
    			attr_dev(button2, "class", "svelte-2np5h6");
    			add_location(button2, file$4, 395, 3, 15570);
    			attr_dev(div1, "class", "calendar-view-pagination-controls svelte-2np5h6");
    			add_location(div1, file$4, 387, 2, 15111);
    			attr_dev(header_1, "class", "calendar-view-header svelte-2np5h6");
    			add_location(header_1, file$4, 380, 1, 14851);
    			attr_dev(div2, "class", "calendar-view-table-wrapper svelte-2np5h6");
    			add_location(div2, file$4, 404, 1, 15975);
    			set_attributes(div3, div_data_3);
    			toggle_class(div3, "floating", /*__floating*/ ctx[9]);
    			toggle_class(div3, "svelte-2np5h6", true);
    			add_location(div3, file$4, 373, 0, 14721);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, header_1);
    			append_dev(header_1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, t0);
    			append_dev(header_1, t1);
    			append_dev(header_1, div1);
    			append_dev(div1, button1);
    			append_dev(button1, svg0);
    			append_dev(svg0, path0);
    			append_dev(div1, t2);
    			append_dev(div1, button2);
    			append_dev(button2, svg1);
    			append_dev(svg1, path1);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			key_block.m(div2, null);
    			/*div3_binding*/ ctx[37](div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[28], false, false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[29], false, false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[30], false, false, false, false),
    					action_destroyer(/*forwardEvents*/ ctx[17].call(null, div3))
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*header*/ 4096) set_data_dev(t0, /*header*/ ctx[12]);

    			if (!current || dirty[0] & /*view*/ 2 && button0_disabled_value !== (button0_disabled_value = /*view*/ ctx[1] === "years")) {
    				prop_dev(button0, "disabled", button0_disabled_value);
    			}

    			if (!current || dirty[0] & /*view, min, page*/ 2114 && button1_disabled_value !== (button1_disabled_value = /*view*/ ctx[1] && /*min*/ ctx[6] >= /*page*/ ctx[11])) {
    				prop_dev(button1, "disabled", button1_disabled_value);
    			}

    			if (!current || dirty[0] & /*max, nextPage*/ 65664 && button2_disabled_value !== (button2_disabled_value = /*max*/ ctx[7] < /*nextPage*/ ctx[16])) {
    				prop_dev(button2, "disabled", button2_disabled_value);
    			}

    			if (dirty[0] & /*view*/ 2 && safe_not_equal(previous_key, previous_key = /*view*/ ctx[1])) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block, 1);
    				key_block.m(div2, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			set_attributes(div3, div_data_3 = get_spread_update(div3_levels, [
    				(!current || dirty[0] & /*className*/ 1024 && div3_class_value !== (div3_class_value = "calendar-view " + /*className*/ ctx[10])) && { class: div3_class_value },
    				dirty[0] & /*$$restProps*/ 67108864 && /*$$restProps*/ ctx[26]
    			]));

    			toggle_class(div3, "floating", /*__floating*/ ctx[9]);
    			toggle_class(div3, "svelte-2np5h6", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			key_block.d(detaching);
    			/*div3_binding*/ ctx[37](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function getWeekdayLocale(day, { locale = undefined, format = "long", offset = 0 } = {}) {
    	return new Intl.DateTimeFormat(locale, { weekday: format, timeZone: "UTC" }).format(new Date(Date.UTC(2000, 1, day + offset - 1)));
    }

    function getMonthLocale(month, { locale = undefined, format = "long" } = {}) {
    	return new Intl.DateTimeFormat(locale, { month: format }).format(new Date(2000, month));
    }

    function getMonthLength(year, month) {
    	return new Date(year, month + 1, 0).getDate() - 1;
    }

    function getMonthDays(year, month) {
    	const days = [];

    	for (let i = 0; i < getMonthLength(year, month) + 1; i++) {
    		days.push(new Date(year, month, i + 1));
    	}

    	return days;
    }

    function getYearMonths(year) {
    	const days = [];

    	for (let i = 0; i < 12; i++) {
    		days.push(new Date(year, i, 1));
    	}

    	return days;
    }

    function compareDates(a, b, precision = "time") {
    	switch (precision) {
    		case "time":
    			return a.getTime() === b.getTime();
    		case "day":
    			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    		case "month":
    			return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
    		case "year":
    			return a.getFullYear() === b.getFullYear();
    		case "decade":
    			return Math.floor(a.getFullYear() / 10) * 10 === Math.floor(b.getFullYear() / 10) * 10;
    	}
    }

    function indexOfDate(array, date, precision = "time") {
    	return array.findIndex(d => compareDates(d, date, precision));
    }

    function getCalendarMonths(date) {
    	const year = date.getFullYear();
    	let months = [];
    	return months.concat(getYearMonths(year), getYearMonths(year + 1).slice(0, 4));
    }

    function getCalendarYears(date) {
    	const decadeStart = Math.floor(date.getFullYear() / 10) * 10;
    	let years = [];

    	for (let i = 0; i < 12; i++) {
    		years.push(new Date(decadeStart + i, 0, 1));
    	}

    	if (decadeStart % 20 === 0) {
    		for (let i = 0; i < 2; i++) {
    			years.unshift(new Date(decadeStart - (i + 1), 0, 1));
    		}

    		for (let i = 0; i < 4; i++) {
    			years.push(new Date(decadeStart + i + 12, 0, 1));
    		}
    	} else {
    		for (let i = 0; i < 6; i++) {
    			years.push(new Date(decadeStart + i + 12, 0, 1));
    		}
    	}

    	return years;
    }

    function getPageByOffset(offset, page, view) {
    	if (view === "days") {
    		return new Date(page.getFullYear(), page.getMonth() + offset, 1);
    	} else if (view === "months") {
    		return new Date(page.getFullYear() + offset, 0, 1);
    	} else if (view === "years") {
    		return new Date(Math.floor(page.getFullYear() / 10) * 10 + offset * 10, 0, 1);
    	}
    }

    function fadeScale(node, { delay = 0, duration = 0, easing = x => x, baseScale = 0 }) {
    	const o = +getComputedStyle(node).opacity;
    	const is = 1 - baseScale;

    	return {
    		delay,
    		duration,
    		css: t => {
    			const eased = easing(t);
    			return `opacity: ${eased * o}; transform: scale(${eased * is + baseScale})`;
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let nextPage;

    	const omit_props_names = [
    		"locale","multiple","headers","value","blackout","min","max","view","weekStart","__floating","class","element"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarView', slots, []);
    	let { locale = undefined } = $$props;
    	let { multiple = false } = $$props;
    	let { headers = false } = $$props;
    	let { value = null } = $$props;
    	let { blackout = undefined } = $$props;
    	let { min = undefined } = $$props;
    	let { max = undefined } = $$props;
    	let { view = "days" } = $$props;
    	let { weekStart = 0 } = $$props;
    	let { __floating = false } = $$props;
    	let { class: className = "" } = $$props;
    	let { element = null } = $$props;
    	const dispatch = createEventDispatcher();
    	const forwardEvents = createEventForwarder(get_current_component(), ["change"]);
    	const bodyElementBinding = node => bodyElement = node; // bind:this breaks with our page transition for some reason
    	let header = "";
    	let viewAnimationDirection = "neutral";
    	let pageAnimationDirection = "neutral";
    	let pageAnimationDuration = 0;
    	let bodyElement = null;
    	let firstValue = Array.isArray(value) ? value[0] : value;

    	let page = (!min || firstValue >= min) && (!max || firstValue < max)
    	? new Date((firstValue !== null && firstValue !== void 0
    			? firstValue
    			: new Date()).getFullYear(),
    		(firstValue !== null && firstValue !== void 0
    			? firstValue
    			: new Date()).getMonth(),
    		1)
    	: firstValue < min
    		? new Date(min.getFullYear(), min.getMonth(), 1)
    		: new Date(max.getFullYear(), max.getMonth(), 1);

    	onMount(() => {
    		$$invalidate(15, pageAnimationDuration = getCSSDuration("--fds-control-slow-duration"));
    	});

    	function getCalendarDays(date) {
    		const year = date.getFullYear();
    		const month = date.getMonth();
    		const firstWeekday = new Date(year, month, 1).getDay();
    		const calendarRows = 6;
    		let days = [];
    		let nextMonth = month + 1;
    		let lastMonth = month - 1;
    		let nextMonthYear = year;
    		let lastMonthYear = year;
    		const daysBefore = (firstWeekday - weekStart + 7) % 7;

    		if (daysBefore > 0) {
    			if (lastMonth === -1) {
    				lastMonth = 11;
    				lastMonthYear = year - 1;
    			}

    			days = getMonthDays(lastMonthYear, lastMonth).slice(-daysBefore);
    		}

    		days = days.concat(getMonthDays(year, month));

    		if (nextMonth === 12) {
    			nextMonth = 0;
    			nextMonthYear = year + 1;
    		}

    		const daysAfter = 7 * calendarRows - days.length;
    		days = days.concat(getMonthDays(nextMonthYear, nextMonth).slice(0, daysAfter));
    		return days;
    	}

    	function updatePage(amount = 0, directionOverride = undefined) {
    		$$invalidate(11, page = getPageByOffset(amount, page, view));

    		if (directionOverride) {
    			$$invalidate(14, pageAnimationDirection = directionOverride);
    			return;
    		}

    		if (amount <= -1) {
    			$$invalidate(14, pageAnimationDirection = "up");
    		} else if (amount >= 1) {
    			$$invalidate(14, pageAnimationDirection = "down");
    		} else {
    			$$invalidate(14, pageAnimationDirection = "neutral");
    		}
    	}

    	function updateView(newView) {
    		if (view === "days" && newView === "months" || view === "months" && newView === "years") {
    			$$invalidate(13, viewAnimationDirection = "up");
    		} else if (view === "years" && newView === "months" || view === "months" && newView === "days") {
    			$$invalidate(13, viewAnimationDirection = "down");
    		} else {
    			$$invalidate(13, viewAnimationDirection = "neutral");
    		}

    		$$invalidate(14, pageAnimationDirection = "neutral");
    		$$invalidate(1, view = newView);
    	}

    	async function handleKeyDown(event, date) {
    		const { key } = event;

    		if (key === "ArrowUp" || key === "ArrowDown" || key === "ArrowLeft" || key === "ArrowRight" || key === "Home" || key === "End") {
    			event.preventDefault();
    		}

    		if (event.ctrlKey && (key === "ArrowUp" || key === "ArrowDown")) {
    			if (key === "ArrowUp") {
    				updateView(view === "days" ? "months" : "years");
    			} else if (key === "ArrowDown") {
    				updateView(view === "years" ? "months" : "days");
    			}

    			return;
    		}

    		let focusOrder = bodyElement.querySelectorAll("button");
    		let focusedDate = date;
    		const focusIndex = Array.from(focusOrder).indexOf(document.activeElement);
    		if (focusOrder.length === 0) return;

    		if (view === "days") {
    			let focusIncrementAmount = {
    				ArrowUp: -7,
    				ArrowDown: 7,
    				ArrowLeft: -1,
    				ArrowRight: 1
    			};

    			if (!focusIncrementAmount[key] || event.shiftKey) return;
    			focusedDate = new Date(new Date(focusedDate).setDate(focusedDate.getDate() + focusIncrementAmount[key]));
    			const nextDateIsBlackout = blackout && indexOfDate(blackout, focusedDate, "day") > -1;

    			if (nextDateIsBlackout) {
    				focusedDate.setDate(focusedDate.getDate() + focusIncrementAmount[key]);
    			}

    			const calendarDays = getCalendarDays(focusedDate);
    			const newFocusedDate = calendarDays.find(day => compareDates(day, focusedDate, "time"));
    			if (min > newFocusedDate || max < newFocusedDate) return;

    			if (focusedDate.getMonth() !== page.getMonth()) {
    				if (key === "ArrowLeft" || key === "ArrowUp") {
    					updatePage(-1, "neutral");
    				} else if (key === "ArrowRight" || key === "ArrowDown") {
    					updatePage(1, "neutral");
    				}

    				await tick();
    				focusOrder = bodyElement.querySelectorAll("button");
    				focusedDate = newFocusedDate;

    				focusOrder === null || focusOrder === void 0
    				? void 0
    				: focusOrder[calendarDays.indexOf(newFocusedDate)].focus();

    				return;
    			}

    			focusOrder === null || focusOrder === void 0
    			? void 0
    			: focusOrder[focusIndex + focusIncrementAmount[key] * (nextDateIsBlackout ? 2 : 1)].focus();
    		} else if (view === "months" || view === "years") {
    			let calendar = [];

    			const focusIncrementAmount = {
    				ArrowUp: -4,
    				ArrowDown: 4,
    				ArrowLeft: -1,
    				ArrowRight: 1
    			};

    			if (!focusIncrementAmount[key] || event.shiftKey) return;

    			if (view === "months") {
    				focusedDate = new Date(new Date(focusedDate).setMonth(focusedDate.getMonth() + focusIncrementAmount[key], 1));
    			} else {
    				focusedDate = new Date(new Date(focusedDate).setFullYear(focusedDate.getFullYear() + focusIncrementAmount[key]));
    			}

    			calendar = view === "months"
    			? getCalendarMonths(focusedDate)
    			: getCalendarYears(focusedDate);

    			const newFocusedDate = calendar.find(day => compareDates(day, focusedDate, view === "months" ? "month" : "year"));

    			const aboveMinimumMonths = (min === null || min === void 0 ? void 0 : min.getMonth()) > newFocusedDate.getMonth() && (min === null || min === void 0
    			? void 0
    			: min.getFullYear()) === newFocusedDate.getFullYear();

    			const aboveMinimumYears = (min === null || min === void 0
    			? void 0
    			: min.getFullYear()) > newFocusedDate.getFullYear();

    			if ((view === "months"
    			? aboveMinimumMonths
    			: aboveMinimumYears) || max < newFocusedDate) return;

    			if (!compareDates(focusedDate, page, view === "months" ? "year" : "decade")) {
    				if (key === "ArrowLeft" || key === "ArrowUp") {
    					updatePage(-1, "neutral");
    				} else if (key === "ArrowRight" || key === "ArrowDown") {
    					updatePage(1, "neutral");
    				}

    				await tick();
    				focusedDate = newFocusedDate;
    				focusOrder = bodyElement.querySelectorAll("button");

    				focusOrder === null || focusOrder === void 0
    				? void 0
    				: focusOrder[calendar.indexOf(newFocusedDate)].focus();

    				return;
    			}

    			focusOrder === null || focusOrder === void 0
    			? void 0
    			: focusOrder[focusIndex + focusIncrementAmount[key]].focus();
    		}
    	}

    	function selectDay(day) {
    		if (multiple) {
    			if (!Array.isArray(value)) {
    				if (value !== null) {
    					$$invalidate(0, value = [value]);
    				} else {
    					$$invalidate(0, value = [day]);
    					return;
    				}
    			}

    			if (indexOfDate(value, day) === -1) {
    				value.push(day);
    				$$invalidate(0, value);
    			} else {
    				$$invalidate(0, value = value.slice(0, indexOfDate(value, day)).concat(value.slice(indexOfDate(value, day) + 1)));
    			}
    		} else {
    			if (Array.isArray(value)) $$invalidate(0, value = null);

    			if (day.getTime() === (value === null || value === void 0
    			? void 0
    			: value.getTime())) {
    				$$invalidate(0, value = null);
    			} else {
    				$$invalidate(0, value = day);
    			}
    		}

    		dispatch("change", value);
    	}

    	function selectMonth(month) {
    		$$invalidate(11, page = new Date(new Date(month.setDate(1))));
    		updateView("days");
    	}

    	function selectYear(month) {
    		page.setFullYear(month.getFullYear());
    		updateView("months");
    	}

    	const click_handler = () => updateView(view === "days" ? "months" : "years");
    	const click_handler_1 = () => updatePage(-1);
    	const click_handler_2 = () => updatePage(1);
    	const click_handler_3 = day => selectDay(day);
    	const keydown_handler = (day, e) => handleKeyDown(e, day);
    	const click_handler_4 = month => selectMonth(month);
    	const keydown_handler_1 = (month, e) => handleKeyDown(e, month);
    	const click_handler_5 = year => selectYear(year);
    	const keydown_handler_2 = (year, e) => handleKeyDown(e, year);

    	function div3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(2, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(26, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('locale' in $$new_props) $$invalidate(3, locale = $$new_props.locale);
    		if ('multiple' in $$new_props) $$invalidate(27, multiple = $$new_props.multiple);
    		if ('headers' in $$new_props) $$invalidate(4, headers = $$new_props.headers);
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('blackout' in $$new_props) $$invalidate(5, blackout = $$new_props.blackout);
    		if ('min' in $$new_props) $$invalidate(6, min = $$new_props.min);
    		if ('max' in $$new_props) $$invalidate(7, max = $$new_props.max);
    		if ('view' in $$new_props) $$invalidate(1, view = $$new_props.view);
    		if ('weekStart' in $$new_props) $$invalidate(8, weekStart = $$new_props.weekStart);
    		if ('__floating' in $$new_props) $$invalidate(9, __floating = $$new_props.__floating);
    		if ('class' in $$new_props) $$invalidate(10, className = $$new_props.class);
    		if ('element' in $$new_props) $$invalidate(2, element = $$new_props.element);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		tick,
    		fly,
    		circOut,
    		get_current_component,
    		createEventForwarder,
    		getCSSDuration,
    		CalendarViewItem,
    		locale,
    		multiple,
    		headers,
    		value,
    		blackout,
    		min,
    		max,
    		view,
    		weekStart,
    		__floating,
    		className,
    		element,
    		dispatch,
    		forwardEvents,
    		bodyElementBinding,
    		header,
    		viewAnimationDirection,
    		pageAnimationDirection,
    		pageAnimationDuration,
    		bodyElement,
    		firstValue,
    		page,
    		getWeekdayLocale,
    		getMonthLocale,
    		getMonthLength,
    		getMonthDays,
    		getYearMonths,
    		compareDates,
    		indexOfDate,
    		getCalendarDays,
    		getCalendarMonths,
    		getCalendarYears,
    		getPageByOffset,
    		updatePage,
    		updateView,
    		handleKeyDown,
    		selectDay,
    		selectMonth,
    		selectYear,
    		fadeScale,
    		nextPage
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('locale' in $$props) $$invalidate(3, locale = $$new_props.locale);
    		if ('multiple' in $$props) $$invalidate(27, multiple = $$new_props.multiple);
    		if ('headers' in $$props) $$invalidate(4, headers = $$new_props.headers);
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('blackout' in $$props) $$invalidate(5, blackout = $$new_props.blackout);
    		if ('min' in $$props) $$invalidate(6, min = $$new_props.min);
    		if ('max' in $$props) $$invalidate(7, max = $$new_props.max);
    		if ('view' in $$props) $$invalidate(1, view = $$new_props.view);
    		if ('weekStart' in $$props) $$invalidate(8, weekStart = $$new_props.weekStart);
    		if ('__floating' in $$props) $$invalidate(9, __floating = $$new_props.__floating);
    		if ('className' in $$props) $$invalidate(10, className = $$new_props.className);
    		if ('element' in $$props) $$invalidate(2, element = $$new_props.element);
    		if ('header' in $$props) $$invalidate(12, header = $$new_props.header);
    		if ('viewAnimationDirection' in $$props) $$invalidate(13, viewAnimationDirection = $$new_props.viewAnimationDirection);
    		if ('pageAnimationDirection' in $$props) $$invalidate(14, pageAnimationDirection = $$new_props.pageAnimationDirection);
    		if ('pageAnimationDuration' in $$props) $$invalidate(15, pageAnimationDuration = $$new_props.pageAnimationDuration);
    		if ('bodyElement' in $$props) bodyElement = $$new_props.bodyElement;
    		if ('firstValue' in $$props) firstValue = $$new_props.firstValue;
    		if ('page' in $$props) $$invalidate(11, page = $$new_props.page);
    		if ('nextPage' in $$props) $$invalidate(16, nextPage = $$new_props.nextPage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			firstValue = Array.isArray(value) ? value[0] : value;
    		}

    		if ($$self.$$.dirty[0] & /*view*/ 2) {
    			(updatePage(0));
    		}

    		if ($$self.$$.dirty[0] & /*page, view*/ 2050) {
    			$$invalidate(16, nextPage = getPageByOffset(1, page, view));
    		}

    		if ($$self.$$.dirty[0] & /*view, locale, page*/ 2058) {
    			if (view === "days") {
    				$$invalidate(12, header = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(page));
    			} else if (view === "months") {
    				$$invalidate(12, header = new Intl.DateTimeFormat(locale, { year: "numeric" }).format(page));
    			} else if (view === "years") {
    				const decadeStart = Math.floor(page.getFullYear() / 10) * 10;
    				const decadeEnd = decadeStart + 9;

    				// https://github.com/microsoft/TypeScript/issues/46905
    				$$invalidate(12, header = new Intl.DateTimeFormat(locale, { year: "numeric" }).formatRange(new Date(decadeStart, 0, 1), new Date(decadeEnd, 0, 1)));
    			}
    		}
    	};

    	return [
    		value,
    		view,
    		element,
    		locale,
    		headers,
    		blackout,
    		min,
    		max,
    		weekStart,
    		__floating,
    		className,
    		page,
    		header,
    		viewAnimationDirection,
    		pageAnimationDirection,
    		pageAnimationDuration,
    		nextPage,
    		forwardEvents,
    		bodyElementBinding,
    		getCalendarDays,
    		updatePage,
    		updateView,
    		handleKeyDown,
    		selectDay,
    		selectMonth,
    		selectYear,
    		$$restProps,
    		multiple,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		keydown_handler,
    		click_handler_4,
    		keydown_handler_1,
    		click_handler_5,
    		keydown_handler_2,
    		div3_binding
    	];
    }

    class CalendarView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$4,
    			safe_not_equal,
    			{
    				locale: 3,
    				multiple: 27,
    				headers: 4,
    				value: 0,
    				blackout: 5,
    				min: 6,
    				max: 7,
    				view: 1,
    				weekStart: 8,
    				__floating: 9,
    				class: 10,
    				element: 2
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarView",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get locale() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get multiple() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set multiple(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get headers() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set headers(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get blackout() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set blackout(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get view() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set view(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get weekStart() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set weekStart(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get __floating() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set __floating(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get element() {
    		throw new Error("<CalendarView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<CalendarView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/CalendarDatePicker/CalendarDatePicker.svelte generated by Svelte v3.59.2 */
    const file$3 = "node_modules/fluent-svelte/CalendarDatePicker/CalendarDatePicker.svelte";

    // (40:1) <Button class="calendar-date-picker-button" {disabled}>
    function create_default_slot_1$1(ctx) {
    	let span;
    	let t0_value = (/*value*/ ctx[0]?.toLocaleDateString(/*locale*/ ctx[2]) ?? /*placeholder*/ ctx[3]) + "";
    	let t0;
    	let t1;
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(span, "class", "calendar-date-picker-label svelte-wlnjxr");
    			toggle_class(span, "disabled", /*disabled*/ ctx[4]);
    			toggle_class(span, "placeholder", typeof /*value*/ ctx[0] === "undefined" || /*value*/ ctx[0] === null);
    			add_location(span, file$3, 40, 2, 1680);
    			attr_dev(path, "d", "M9.2793 0.75C9.47461 0.75 9.66016 0.791016 9.83594 0.873047C10.0156 0.951172 10.1719 1.05859 10.3047 1.19531C10.4414 1.32813 10.5488 1.48437 10.627 1.66406C10.709 1.83984 10.75 2.02539 10.75 2.2207V9.7793C10.75 9.97461 10.709 10.1621 10.627 10.3418C10.5488 10.5176 10.4414 10.6738 10.3047 10.8105C10.1719 10.9434 10.0156 11.0508 9.83594 11.1328C9.66016 11.2109 9.47461 11.25 9.2793 11.25H1.7207C1.52539 11.25 1.33789 11.2109 1.1582 11.1328C0.982422 11.0508 0.826172 10.9434 0.689453 10.8105C0.556641 10.6738 0.449219 10.5176 0.367188 10.3418C0.289062 10.1621 0.25 9.97461 0.25 9.7793V2.2207C0.25 2.02539 0.289062 1.83984 0.367188 1.66406C0.449219 1.48437 0.556641 1.32813 0.689453 1.19531C0.826172 1.05859 0.982422 0.951172 1.1582 0.873047C1.33789 0.791016 1.52539 0.75 1.7207 0.75H9.2793ZM1.75 1.5C1.64453 1.5 1.54688 1.51953 1.45703 1.55859C1.36719 1.59766 1.28711 1.65234 1.2168 1.72266C1.15039 1.78906 1.09766 1.86719 1.05859 1.95703C1.01953 2.04688 1 2.14453 1 2.25V3H10V2.25C10 2.14844 9.98047 2.05273 9.94141 1.96289C9.90234 1.86914 9.84766 1.78906 9.77734 1.72266C9.71094 1.65234 9.63086 1.59766 9.53711 1.55859C9.44727 1.51953 9.35156 1.5 9.25 1.5H1.75ZM9.25 10.5C9.35547 10.5 9.45312 10.4805 9.54297 10.4414C9.63281 10.4023 9.71094 10.3496 9.77734 10.2832C9.84766 10.2129 9.90234 10.1328 9.94141 10.043C9.98047 9.95312 10 9.85547 10 9.75V3.75H1V9.75C1 9.85547 1.01953 9.95508 1.05859 10.0488C1.09766 10.1387 1.15039 10.2168 1.2168 10.2832C1.2832 10.3496 1.36133 10.4023 1.45117 10.4414C1.54492 10.4805 1.64453 10.5 1.75 10.5H9.25ZM2.5 6C2.5 5.89453 2.51953 5.79688 2.55859 5.70703C2.59766 5.61719 2.65039 5.53906 2.7168 5.47266C2.78711 5.40234 2.86719 5.34766 2.95703 5.30859C3.05078 5.26953 3.15039 5.25 3.25586 5.25C3.36133 5.25 3.45898 5.26953 3.54883 5.30859C3.63867 5.34766 3.7168 5.40039 3.7832 5.4668C3.84961 5.5332 3.90234 5.61133 3.94141 5.70117C3.98047 5.79102 4 5.88867 4 5.99414C4 6.09961 3.98047 6.19922 3.94141 6.29297C3.90234 6.38281 3.84766 6.46289 3.77734 6.5332C3.71094 6.59961 3.63281 6.65234 3.54297 6.69141C3.45312 6.73047 3.35547 6.75 3.25 6.75C3.14453 6.75 3.04492 6.73047 2.95117 6.69141C2.86133 6.65234 2.7832 6.59961 2.7168 6.5332C2.65039 6.4668 2.59766 6.38867 2.55859 6.29883C2.51953 6.20508 2.5 6.10547 2.5 6ZM4.75 6C4.75 5.89453 4.76953 5.79688 4.80859 5.70703C4.84766 5.61719 4.90039 5.53906 4.9668 5.47266C5.03711 5.40234 5.11719 5.34766 5.20703 5.30859C5.30078 5.26953 5.40039 5.25 5.50586 5.25C5.61133 5.25 5.70898 5.26953 5.79883 5.30859C5.88867 5.34766 5.9668 5.40039 6.0332 5.4668C6.09961 5.5332 6.15234 5.61133 6.19141 5.70117C6.23047 5.79102 6.25 5.88867 6.25 5.99414C6.25 6.09961 6.23047 6.19922 6.19141 6.29297C6.15234 6.38281 6.09766 6.46289 6.02734 6.5332C5.96094 6.59961 5.88281 6.65234 5.79297 6.69141C5.70312 6.73047 5.60547 6.75 5.5 6.75C5.39453 6.75 5.29492 6.73047 5.20117 6.69141C5.11133 6.65234 5.0332 6.59961 4.9668 6.5332C4.90039 6.4668 4.84766 6.38867 4.80859 6.29883C4.76953 6.20508 4.75 6.10547 4.75 6ZM8.5 5.99414C8.5 6.09961 8.48047 6.19922 8.44141 6.29297C8.40234 6.38281 8.34766 6.46289 8.27734 6.5332C8.21094 6.59961 8.13281 6.65234 8.04297 6.69141C7.95312 6.73047 7.85547 6.75 7.75 6.75C7.64453 6.75 7.54492 6.73047 7.45117 6.69141C7.36133 6.65234 7.2832 6.59961 7.2168 6.5332C7.15039 6.4668 7.09766 6.38867 7.05859 6.29883C7.01953 6.20508 7 6.10547 7 6C7 5.89453 7.01953 5.79688 7.05859 5.70703C7.09766 5.61719 7.15039 5.53906 7.2168 5.47266C7.28711 5.40234 7.36719 5.34766 7.45703 5.30859C7.55078 5.26953 7.65039 5.25 7.75586 5.25C7.86133 5.25 7.95898 5.26953 8.04883 5.30859C8.13867 5.34766 8.2168 5.40039 8.2832 5.4668C8.34961 5.5332 8.40234 5.61133 8.44141 5.70117C8.48047 5.79102 8.5 5.88867 8.5 5.99414ZM4 8.25C4 8.35547 3.98047 8.45312 3.94141 8.54297C3.90234 8.63281 3.84766 8.71289 3.77734 8.7832C3.71094 8.84961 3.63086 8.90234 3.53711 8.94141C3.44727 8.98047 3.34961 9 3.24414 9C3.13867 9 3.04102 8.98047 2.95117 8.94141C2.86133 8.90234 2.7832 8.84961 2.7168 8.7832C2.65039 8.7168 2.59766 8.63867 2.55859 8.54883C2.51953 8.45898 2.5 8.36133 2.5 8.25586C2.5 8.15039 2.51953 8.05273 2.55859 7.96289C2.59766 7.86914 2.65039 7.78906 2.7168 7.72266C2.78711 7.65234 2.86719 7.59766 2.95703 7.55859C3.04688 7.51953 3.14453 7.5 3.25 7.5C3.35547 7.5 3.45312 7.51953 3.54297 7.55859C3.63672 7.59766 3.7168 7.65039 3.7832 7.7168C3.84961 7.7832 3.90234 7.86328 3.94141 7.95703C3.98047 8.04688 4 8.14453 4 8.25ZM6.25 8.25C6.25 8.35547 6.23047 8.45312 6.19141 8.54297C6.15234 8.63281 6.09766 8.71289 6.02734 8.7832C5.96094 8.84961 5.88086 8.90234 5.78711 8.94141C5.69727 8.98047 5.59961 9 5.49414 9C5.38867 9 5.29102 8.98047 5.20117 8.94141C5.11133 8.90234 5.0332 8.84961 4.9668 8.7832C4.90039 8.7168 4.84766 8.63867 4.80859 8.54883C4.76953 8.45898 4.75 8.36133 4.75 8.25586C4.75 8.15039 4.76953 8.05273 4.80859 7.96289C4.84766 7.86914 4.90039 7.78906 4.9668 7.72266C5.03711 7.65234 5.11719 7.59766 5.20703 7.55859C5.29688 7.51953 5.39453 7.5 5.5 7.5C5.60547 7.5 5.70312 7.51953 5.79297 7.55859C5.88672 7.59766 5.9668 7.65039 6.0332 7.7168C6.09961 7.7832 6.15234 7.86328 6.19141 7.95703C6.23047 8.04688 6.25 8.14453 6.25 8.25Z");
    			add_location(path, file$3, 55, 3, 2036);
    			attr_dev(svg, "class", "calendar-date-picker-icon svelte-wlnjxr");
    			attr_dev(svg, "width", "12");
    			attr_dev(svg, "height", "12");
    			attr_dev(svg, "viewBox", "0 0 11 12");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg, file$3, 47, 2, 1882);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*value, locale, placeholder*/ 13 && t0_value !== (t0_value = (/*value*/ ctx[0]?.toLocaleDateString(/*locale*/ ctx[2]) ?? /*placeholder*/ ctx[3]) + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*disabled*/ 16) {
    				toggle_class(span, "disabled", /*disabled*/ ctx[4]);
    			}

    			if (dirty & /*value*/ 1) {
    				toggle_class(span, "placeholder", typeof /*value*/ ctx[0] === "undefined" || /*value*/ ctx[0] === null);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(40:1) <Button class=\\\"calendar-date-picker-button\\\" {disabled}>",
    		ctx
    	});

    	return block;
    }

    // (31:0) <Flyout  class="calendar-date-picker-container"  bind:open  {closable}  {placement}  {alignment}  {offset}  {trapFocus} >
    function create_default_slot$1(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				class: "calendar-date-picker-button",
    				disabled: /*disabled*/ ctx[4],
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*disabled*/ 16) button_changes.disabled = /*disabled*/ ctx[4];

    			if (dirty & /*$$scope, disabled, value, locale, placeholder*/ 32797) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(31:0) <Flyout  class=\\\"calendar-date-picker-container\\\"  bind:open  {closable}  {placement}  {alignment}  {offset}  {trapFocus} >",
    		ctx
    	});

    	return block;
    }

    // (61:1) 
    function create_override_slot(ctx) {
    	let calendarview;
    	let updating_value;
    	let current;

    	const calendarview_spread_levels = [
    		{ slot: "override" },
    		{ class: "calendar-date-picker-calendar" },
    		{ multiple: false },
    		{ __floating: true },
    		/*$$restProps*/ ctx[11]
    	];

    	function calendarview_value_binding(value) {
    		/*calendarview_value_binding*/ ctx[12](value);
    	}

    	let calendarview_props = {};

    	for (let i = 0; i < calendarview_spread_levels.length; i += 1) {
    		calendarview_props = assign(calendarview_props, calendarview_spread_levels[i]);
    	}

    	if (/*value*/ ctx[0] !== void 0) {
    		calendarview_props.value = /*value*/ ctx[0];
    	}

    	calendarview = new CalendarView({
    			props: calendarview_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(calendarview, 'value', calendarview_value_binding));
    	calendarview.$on("keydown", /*handleKeyDown*/ ctx[10]);
    	calendarview.$on("change", /*change_handler*/ ctx[13]);

    	const block = {
    		c: function create() {
    			create_component(calendarview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(calendarview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const calendarview_changes = (dirty & /*$$restProps*/ 2048)
    			? get_spread_update(calendarview_spread_levels, [
    					calendarview_spread_levels[0],
    					calendarview_spread_levels[1],
    					calendarview_spread_levels[2],
    					calendarview_spread_levels[3],
    					get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				calendarview_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			calendarview.$set(calendarview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(calendarview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(calendarview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(calendarview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_override_slot.name,
    		type: "slot",
    		source: "(61:1) ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let flyout;
    	let updating_open;
    	let current;

    	function flyout_open_binding(value) {
    		/*flyout_open_binding*/ ctx[14](value);
    	}

    	let flyout_props = {
    		class: "calendar-date-picker-container",
    		closable: /*closable*/ ctx[5],
    		placement: /*placement*/ ctx[6],
    		alignment: /*alignment*/ ctx[7],
    		offset: /*offset*/ ctx[8],
    		trapFocus: /*trapFocus*/ ctx[9],
    		$$slots: {
    			override: [create_override_slot],
    			default: [create_default_slot$1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*open*/ ctx[1] !== void 0) {
    		flyout_props.open = /*open*/ ctx[1];
    	}

    	flyout = new FlyoutWrapper({ props: flyout_props, $$inline: true });
    	binding_callbacks.push(() => bind(flyout, 'open', flyout_open_binding));

    	const block = {
    		c: function create() {
    			create_component(flyout.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(flyout, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const flyout_changes = {};
    			if (dirty & /*closable*/ 32) flyout_changes.closable = /*closable*/ ctx[5];
    			if (dirty & /*placement*/ 64) flyout_changes.placement = /*placement*/ ctx[6];
    			if (dirty & /*alignment*/ 128) flyout_changes.alignment = /*alignment*/ ctx[7];
    			if (dirty & /*offset*/ 256) flyout_changes.offset = /*offset*/ ctx[8];
    			if (dirty & /*trapFocus*/ 512) flyout_changes.trapFocus = /*trapFocus*/ ctx[9];

    			if (dirty & /*$$scope, $$restProps, value, open, disabled, locale, placeholder*/ 34847) {
    				flyout_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*open*/ 2) {
    				updating_open = true;
    				flyout_changes.open = /*open*/ ctx[1];
    				add_flush_callback(() => updating_open = false);
    			}

    			flyout.$set(flyout_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flyout.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flyout.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flyout, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = [
    		"value","open","locale","placeholder","disabled","closable","placement","alignment","offset","trapFocus"
    	];

    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('CalendarDatePicker', slots, []);
    	let { value } = $$props;
    	let { open = false } = $$props;
    	let { locale = undefined } = $$props;
    	let { placeholder = "Pick a date" } = $$props;
    	let { disabled = false } = $$props;
    	let { closable = true } = $$props;
    	let { placement = "bottom" } = $$props;
    	let { alignment = "center" } = $$props;
    	let { offset = 4 } = $$props;
    	let { trapFocus = true } = $$props;

    	function handleKeyDown(event) {
    		event.stopPropagation();
    		if (event.key === "Escape") $$invalidate(1, open = false);
    	}

    	$$self.$$.on_mount.push(function () {
    		if (value === undefined && !('value' in $$props || $$self.$$.bound[$$self.$$.props['value']])) {
    			console.warn("<CalendarDatePicker> was created without expected prop 'value'");
    		}
    	});

    	function calendarview_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(0, value);
    	}

    	const change_handler = () => $$invalidate(1, open = false);

    	function flyout_open_binding(value) {
    		open = value;
    		$$invalidate(1, open);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('open' in $$new_props) $$invalidate(1, open = $$new_props.open);
    		if ('locale' in $$new_props) $$invalidate(2, locale = $$new_props.locale);
    		if ('placeholder' in $$new_props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('disabled' in $$new_props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('closable' in $$new_props) $$invalidate(5, closable = $$new_props.closable);
    		if ('placement' in $$new_props) $$invalidate(6, placement = $$new_props.placement);
    		if ('alignment' in $$new_props) $$invalidate(7, alignment = $$new_props.alignment);
    		if ('offset' in $$new_props) $$invalidate(8, offset = $$new_props.offset);
    		if ('trapFocus' in $$new_props) $$invalidate(9, trapFocus = $$new_props.trapFocus);
    	};

    	$$self.$capture_state = () => ({
    		CalendarView,
    		Flyout: FlyoutWrapper,
    		Button,
    		value,
    		open,
    		locale,
    		placeholder,
    		disabled,
    		closable,
    		placement,
    		alignment,
    		offset,
    		trapFocus,
    		handleKeyDown
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('open' in $$props) $$invalidate(1, open = $$new_props.open);
    		if ('locale' in $$props) $$invalidate(2, locale = $$new_props.locale);
    		if ('placeholder' in $$props) $$invalidate(3, placeholder = $$new_props.placeholder);
    		if ('disabled' in $$props) $$invalidate(4, disabled = $$new_props.disabled);
    		if ('closable' in $$props) $$invalidate(5, closable = $$new_props.closable);
    		if ('placement' in $$props) $$invalidate(6, placement = $$new_props.placement);
    		if ('alignment' in $$props) $$invalidate(7, alignment = $$new_props.alignment);
    		if ('offset' in $$props) $$invalidate(8, offset = $$new_props.offset);
    		if ('trapFocus' in $$props) $$invalidate(9, trapFocus = $$new_props.trapFocus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		value,
    		open,
    		locale,
    		placeholder,
    		disabled,
    		closable,
    		placement,
    		alignment,
    		offset,
    		trapFocus,
    		handleKeyDown,
    		$$restProps,
    		calendarview_value_binding,
    		change_handler,
    		flyout_open_binding
    	];
    }

    class CalendarDatePicker extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			value: 0,
    			open: 1,
    			locale: 2,
    			placeholder: 3,
    			disabled: 4,
    			closable: 5,
    			placement: 6,
    			alignment: 7,
    			offset: 8,
    			trapFocus: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CalendarDatePicker",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get value() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get open() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get locale() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set locale(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placeholder() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placeholder(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get closable() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set closable(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get offset() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set offset(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trapFocus() {
    		throw new Error("<CalendarDatePicker>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trapFocus(value) {
    		throw new Error("<CalendarDatePicker>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/fluent-svelte/NavigationView/NavigationView.svelte generated by Svelte v3.59.2 */
    const file$2 = "node_modules/fluent-svelte/NavigationView/NavigationView.svelte";
    const get_footer_slot_changes = dirty => ({});
    const get_footer_slot_context = ctx => ({});
    const get_items_slot_changes = dirty => ({});
    const get_items_slot_context = ctx => ({});
    const get_header_slot_changes = dirty => ({});
    const get_header_slot_context = ctx => ({});

    // (12:3) {#if backButton}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = `${"<-"}`;
    			add_location(button, file$2, 12, 4, 409);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[7], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(12:3) {#if backButton}",
    		ctx
    	});

    	return block;
    }

    // (17:3) {#if menuButton}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = `${"-"}`;
    			add_location(button, file$2, 17, 4, 511);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_1*/ ctx[8], false, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(17:3) {#if menuButton}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let main;
    	let aside;
    	let header;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let footer;
    	let t4;
    	let article;
    	let main_class_value;
    	let current;
    	let if_block0 = /*backButton*/ ctx[3] && create_if_block_1(ctx);
    	let if_block1 = /*menuButton*/ ctx[2] && create_if_block(ctx);
    	const header_slot_template = /*#slots*/ ctx[6].header;
    	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[5], get_header_slot_context);
    	const items_slot_template = /*#slots*/ ctx[6].items;
    	const items_slot = create_slot(items_slot_template, ctx, /*$$scope*/ ctx[5], get_items_slot_context);
    	const footer_slot_template = /*#slots*/ ctx[6].footer;
    	const footer_slot = create_slot(footer_slot_template, ctx, /*$$scope*/ ctx[5], get_footer_slot_context);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			aside = element("aside");
    			header = element("header");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (header_slot) header_slot.c();
    			t2 = space();
    			if (items_slot) items_slot.c();
    			t3 = space();
    			footer = element("footer");
    			if (footer_slot) footer_slot.c();
    			t4 = space();
    			article = element("article");
    			if (default_slot) default_slot.c();
    			attr_dev(header, "class", "navigation-view-pane-header svelte-z527vv");
    			add_location(header, file$2, 10, 2, 340);
    			attr_dev(footer, "class", "navigation-view-pane-footer");
    			add_location(footer, file$2, 25, 2, 659);
    			attr_dev(aside, "class", "navigation-view-pane svelte-z527vv");
    			toggle_class(aside, "expanded", /*expanded*/ ctx[0]);
    			add_location(aside, file$2, 9, 1, 286);
    			attr_dev(article, "class", "navigation-view-page svelte-z527vv");
    			add_location(article, file$2, 29, 1, 753);
    			attr_dev(main, "class", main_class_value = "navigation-view variant-" + /*variant*/ ctx[1] + " svelte-z527vv");
    			add_location(main, file$2, 8, 0, 236);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, aside);
    			append_dev(aside, header);
    			if (if_block0) if_block0.m(header, null);
    			append_dev(header, t0);
    			if (if_block1) if_block1.m(header, null);
    			append_dev(header, t1);

    			if (header_slot) {
    				header_slot.m(header, null);
    			}

    			append_dev(aside, t2);

    			if (items_slot) {
    				items_slot.m(aside, null);
    			}

    			append_dev(aside, t3);
    			append_dev(aside, footer);

    			if (footer_slot) {
    				footer_slot.m(footer, null);
    			}

    			append_dev(main, t4);
    			append_dev(main, article);

    			if (default_slot) {
    				default_slot.m(article, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*backButton*/ ctx[3]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(header, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*menuButton*/ ctx[2]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(header, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (header_slot) {
    				if (header_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						header_slot,
    						header_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(header_slot_template, /*$$scope*/ ctx[5], dirty, get_header_slot_changes),
    						get_header_slot_context
    					);
    				}
    			}

    			if (items_slot) {
    				if (items_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						items_slot,
    						items_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(items_slot_template, /*$$scope*/ ctx[5], dirty, get_items_slot_changes),
    						get_items_slot_context
    					);
    				}
    			}

    			if (footer_slot) {
    				if (footer_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						footer_slot,
    						footer_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(footer_slot_template, /*$$scope*/ ctx[5], dirty, get_footer_slot_changes),
    						get_footer_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*expanded*/ 1) {
    				toggle_class(aside, "expanded", /*expanded*/ ctx[0]);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*variant*/ 2 && main_class_value !== (main_class_value = "navigation-view variant-" + /*variant*/ ctx[1] + " svelte-z527vv")) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header_slot, local);
    			transition_in(items_slot, local);
    			transition_in(footer_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header_slot, local);
    			transition_out(items_slot, local);
    			transition_out(footer_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (header_slot) header_slot.d(detaching);
    			if (items_slot) items_slot.d(detaching);
    			if (footer_slot) footer_slot.d(detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NavigationView', slots, ['header','items','footer','default']);
    	let { variant = "default" } = $$props;
    	let { expanded = true } = $$props;
    	let { menuButton = true } = $$props;
    	let { backButton = true } = $$props;
    	const dispatch = createEventDispatcher();
    	const writable_props = ['variant', 'expanded', 'menuButton', 'backButton'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<NavigationView> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => dispatch("back");
    	const click_handler_1 = () => $$invalidate(0, expanded = !expanded);

    	$$self.$$set = $$props => {
    		if ('variant' in $$props) $$invalidate(1, variant = $$props.variant);
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('menuButton' in $$props) $$invalidate(2, menuButton = $$props.menuButton);
    		if ('backButton' in $$props) $$invalidate(3, backButton = $$props.backButton);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		variant,
    		expanded,
    		menuButton,
    		backButton,
    		dispatch
    	});

    	$$self.$inject_state = $$props => {
    		if ('variant' in $$props) $$invalidate(1, variant = $$props.variant);
    		if ('expanded' in $$props) $$invalidate(0, expanded = $$props.expanded);
    		if ('menuButton' in $$props) $$invalidate(2, menuButton = $$props.menuButton);
    		if ('backButton' in $$props) $$invalidate(3, backButton = $$props.backButton);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		expanded,
    		variant,
    		menuButton,
    		backButton,
    		dispatch,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1
    	];
    }

    class NavigationView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			variant: 1,
    			expanded: 0,
    			menuButton: 2,
    			backButton: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavigationView",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get variant() {
    		throw new Error("<NavigationView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variant(value) {
    		throw new Error("<NavigationView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<NavigationView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<NavigationView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get menuButton() {
    		throw new Error("<NavigationView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set menuButton(value) {
    		throw new Error("<NavigationView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get backButton() {
    		throw new Error("<NavigationView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set backButton(value) {
    		throw new Error("<NavigationView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Fluent = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AutoSuggestBox: AutoSuggestBox,
        Button: Button,
        CalendarDatePicker: CalendarDatePicker,
        CalendarView: CalendarView,
        Checkbox: Checkbox,
        ComboBox: ComboBox,
        ContentDialog: ContentDialog,
        ContextMenu: ContextMenu,
        Expander: Expander,
        Flyout: FlyoutWrapper,
        IconButton: IconButton,
        InfoBadge: InfoBadge,
        InfoBar: InfoBar,
        ListItem: ListItem,
        MenuBar: MenuBar,
        MenuBarItem: MenuBarItem,
        MenuFlyout: MenuFlyoutWrapper,
        MenuFlyoutDivider: MenuFlyoutDivider,
        MenuFlyoutItem: MenuFlyoutItem,
        NavigationView: NavigationView,
        NumberBox: NumberBox,
        PersonPicture: PersonPicture,
        ProgressBar: ProgressBar,
        ProgressRing: ProgressRing,
        RadioButton: RadioButton,
        Slider: Slider,
        TextBlock: TextBlock,
        TextBox: TextBox,
        TextBoxButton: TextBoxButton,
        ToggleSwitch: ToggleSwitch,
        Tooltip: TooltipWrapper
    });

    /* src/frontend/LCETool/UI/SplitPane.svelte generated by Svelte v3.59.2 */

    const file$1 = "src/frontend/LCETool/UI/SplitPane.svelte";
    const get_right_slot_changes = dirty => ({});
    const get_right_slot_context = ctx => ({});
    const get_left_slot_changes = dirty => ({});
    const get_left_slot_context = ctx => ({});

    function create_fragment$1(ctx) {
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let script;
    	let current;
    	let mounted;
    	let dispose;
    	const left_slot_template = /*#slots*/ ctx[7].left;
    	const left_slot = create_slot(left_slot_template, ctx, /*$$scope*/ ctx[6], get_left_slot_context);
    	const right_slot_template = /*#slots*/ ctx[7].right;
    	const right_slot = create_slot(right_slot_template, ctx, /*$$scope*/ ctx[6], get_right_slot_context);

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			if (left_slot) left_slot.c();
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			if (right_slot) right_slot.c();
    			t2 = space();
    			script = element("script");
    			script.textContent = "//onResize(null);";
    			attr_dev(div0, "class", "pane svelte-xr8rdd");
    			set_style(div0, "width", "32.648125755743652%");
    			set_style(div0, "padding", "10px");
    			add_location(div0, file$1, 67, 1, 1836);
    			attr_dev(div1, "class", "splitter svelte-xr8rdd");
    			add_location(div1, file$1, 70, 1, 1961);
    			attr_dev(div2, "class", "pane svelte-xr8rdd");
    			set_style(div2, "flex", "1");
    			add_location(div2, file$1, 71, 1, 2039);
    			attr_dev(script, "lang", "ts");
    			add_location(script, file$1, 74, 1, 2134);
    			attr_dev(div3, "class", "container svelte-xr8rdd");
    			add_location(div3, file$1, 66, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);

    			if (left_slot) {
    				left_slot.m(div0, null);
    			}

    			/*div0_binding*/ ctx[8](div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			/*div1_binding*/ ctx[9](div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);

    			if (right_slot) {
    				right_slot.m(div2, null);
    			}

    			/*div2_binding*/ ctx[10](div2);
    			append_dev(div3, t2);
    			append_dev(div3, script);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mousedown", /*onMouseDown*/ ctx[3], false, false, false, false),
    					listen_dev(div3, "mousemove", /*onMouseMove*/ ctx[4], false, false, false, false),
    					listen_dev(div3, "mouseup", /*onMouseUp*/ ctx[5], false, false, false, false),
    					listen_dev(div3, "mouseleave", /*onMouseUp*/ ctx[5], false, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (left_slot) {
    				if (left_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						left_slot,
    						left_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(left_slot_template, /*$$scope*/ ctx[6], dirty, get_left_slot_changes),
    						get_left_slot_context
    					);
    				}
    			}

    			if (right_slot) {
    				if (right_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						right_slot,
    						right_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(right_slot_template, /*$$scope*/ ctx[6], dirty, get_right_slot_changes),
    						get_right_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(left_slot, local);
    			transition_in(right_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(left_slot, local);
    			transition_out(right_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (left_slot) left_slot.d(detaching);
    			/*div0_binding*/ ctx[8](null);
    			/*div1_binding*/ ctx[9](null);
    			if (right_slot) right_slot.d(detaching);
    			/*div2_binding*/ ctx[10](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function elementValid(element) {
    	return element !== null && element !== undefined && element !== void 0;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SplitPane', slots, ['left','right']);
    	let startX, startWidth, isResizing = false;

    	function onMouseDown(event) {
    		startX = event.clientX;
    		startWidth = leftPane.offsetWidth;
    		isResizing = true;
    	}

    	function onMouseMove(event) {
    		if (!isResizing) {
    			return;
    		}

    		const dx = event.clientX - startX;
    		var padding = parseInt(leftPane.style.padding) * 2;

    		if (Number.isNaN(padding)) {
    			padding = 0;
    		}

    		$$invalidate(0, leftPane.style.width = `${(startWidth + dx - padding) / window.innerWidth * 100.0}%`, leftPane);
    	}

    	function onMouseUp(event) {
    		isResizing = false;
    	}

    	function adjustPaneSize(event) {
    		if (!(elementValid(leftPane) && elementValid(rightPane) && elementValid(splitter))) {
    			return;
    		}

    		var h = window.innerHeight;
    		const paneHeight = h - 68;
    		const splitterMargin = paneHeight / 2 - 50;
    		$$invalidate(0, leftPane.style.height = `${paneHeight}px`, leftPane);
    		$$invalidate(1, rightPane.style.height = `${paneHeight}px`, rightPane);
    		$$invalidate(2, splitter.style.marginTop = `${splitterMargin}px`, splitter);
    		$$invalidate(2, splitter.style.marginBottom = `${splitterMargin}px`, splitter);
    	}

    	window.addEventListener("DOMContentLoaded", adjustPaneSize);
    	window.addEventListener("resize", adjustPaneSize);
    	let leftPane;
    	let rightPane;
    	let splitter;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SplitPane> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			leftPane = $$value;
    			$$invalidate(0, leftPane);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			splitter = $$value;
    			$$invalidate(2, splitter);
    		});
    	}

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			rightPane = $$value;
    			$$invalidate(1, rightPane);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		startX,
    		startWidth,
    		isResizing,
    		elementValid,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		adjustPaneSize,
    		leftPane,
    		rightPane,
    		splitter
    	});

    	$$self.$inject_state = $$props => {
    		if ('startX' in $$props) startX = $$props.startX;
    		if ('startWidth' in $$props) startWidth = $$props.startWidth;
    		if ('isResizing' in $$props) isResizing = $$props.isResizing;
    		if ('leftPane' in $$props) $$invalidate(0, leftPane = $$props.leftPane);
    		if ('rightPane' in $$props) $$invalidate(1, rightPane = $$props.rightPane);
    		if ('splitter' in $$props) $$invalidate(2, splitter = $$props.splitter);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		leftPane,
    		rightPane,
    		splitter,
    		onMouseDown,
    		onMouseMove,
    		onMouseUp,
    		$$scope,
    		slots,
    		div0_binding,
    		div1_binding,
    		div2_binding
    	];
    }

    class SplitPane extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SplitPane",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i].name;
    	child_ctx[12] = list[i].content;
    	return child_ctx;
    }

    // (61:2) 
    function create_left_slot(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Left Pane";
    			t1 = space();
    			p = element("p");
    			p.textContent = "the data path (file?) explorer will go here";
    			add_location(h1, file, 61, 3, 1873);
    			add_location(p, file, 62, 3, 1895);
    			attr_dev(div, "slot", "left");
    			add_location(div, file, 60, 2, 1852);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_left_slot.name,
    		type: "slot",
    		source: "(61:2) ",
    		ctx
    	});

    	return block;
    }

    // (69:3) <Fluent.Checkbox bind:checked={listSel}>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("hi");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(69:3) <Fluent.Checkbox bind:checked={listSel}>",
    		ctx
    	});

    	return block;
    }

    // (71:3) <Fluent.ListItem bind:selected={listSel} on:click={() => (listSel = !listSel)}>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Text");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(71:3) <Fluent.ListItem bind:selected={listSel} on:click={() => (listSel = !listSel)}>",
    		ctx
    	});

    	return block;
    }

    // (77:4) {#each exampleFileList as { name, content }}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*name*/ ctx[11] + "";
    	let t0;
    	let t1;
    	let t2_value = /*content*/ ctx[12] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(": ");
    			t2 = text(t2_value);
    			t3 = space();
    			add_location(p, file, 77, 5, 2414);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(77:4) {#each exampleFileList as { name, content }}",
    		ctx
    	});

    	return block;
    }

    // (83:3) <Fluent.Button on:click={() => (displayWarningDialog = true)}>
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Open Dialog");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(83:3) <Fluent.Button on:click={() => (displayWarningDialog = true)}>",
    		ctx
    	});

    	return block;
    }

    // (65:2) 
    function create_right_slot(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let fluent_checkbox;
    	let updating_checked;
    	let t4;
    	let fluent_textbox;
    	let updating_value;
    	let t5;
    	let fluent_listitem;
    	let updating_selected;
    	let t6;
    	let p1;
    	let t7;
    	let t8;
    	let t9;
    	let br;
    	let t10;
    	let t11_value = (/*listSel*/ ctx[1] ? "checked" : "unchecked") + "";
    	let t11;
    	let t12;
    	let p2;
    	let t13;
    	let fluent_button;
    	let current;

    	function fluent_checkbox_checked_binding(value) {
    		/*fluent_checkbox_checked_binding*/ ctx[4](value);
    	}

    	let fluent_checkbox_props = {
    		$$slots: { default: [create_default_slot_4] },
    		$$scope: { ctx }
    	};

    	if (/*listSel*/ ctx[1] !== void 0) {
    		fluent_checkbox_props.checked = /*listSel*/ ctx[1];
    	}

    	fluent_checkbox = new Checkbox({
    			props: fluent_checkbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fluent_checkbox, 'checked', fluent_checkbox_checked_binding));

    	function fluent_textbox_value_binding(value) {
    		/*fluent_textbox_value_binding*/ ctx[5](value);
    	}

    	let fluent_textbox_props = {};

    	if (/*value*/ ctx[2] !== void 0) {
    		fluent_textbox_props.value = /*value*/ ctx[2];
    	}

    	fluent_textbox = new TextBox({
    			props: fluent_textbox_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fluent_textbox, 'value', fluent_textbox_value_binding));

    	function fluent_listitem_selected_binding(value) {
    		/*fluent_listitem_selected_binding*/ ctx[6](value);
    	}

    	let fluent_listitem_props = {
    		$$slots: { default: [create_default_slot_3] },
    		$$scope: { ctx }
    	};

    	if (/*listSel*/ ctx[1] !== void 0) {
    		fluent_listitem_props.selected = /*listSel*/ ctx[1];
    	}

    	fluent_listitem = new ListItem({
    			props: fluent_listitem_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fluent_listitem, 'selected', fluent_listitem_selected_binding));
    	fluent_listitem.$on("click", /*click_handler*/ ctx[7]);
    	let each_value = /*exampleFileList*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	fluent_button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fluent_button.$on("click", /*click_handler_1*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Right Pane";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "the nbt editor will go here, have some test stuff";
    			t3 = space();
    			create_component(fluent_checkbox.$$.fragment);
    			t4 = space();
    			create_component(fluent_textbox.$$.fragment);
    			t5 = space();
    			create_component(fluent_listitem.$$.fragment);
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Current: ");
    			t8 = text(/*value*/ ctx[2]);
    			t9 = space();
    			br = element("br");
    			t10 = text("\n\t\t\t\tlistSel: ");
    			t11 = text(t11_value);
    			t12 = space();
    			p2 = element("p");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			create_component(fluent_button.$$.fragment);
    			add_location(h1, file, 65, 3, 1979);
    			add_location(p0, file, 66, 3, 2002);
    			add_location(br, file, 72, 21, 2290);
    			add_location(p1, file, 71, 3, 2265);
    			add_location(p2, file, 75, 3, 2356);
    			attr_dev(div, "slot", "right");
    			add_location(div, file, 64, 2, 1957);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			mount_component(fluent_checkbox, div, null);
    			append_dev(div, t4);
    			mount_component(fluent_textbox, div, null);
    			append_dev(div, t5);
    			mount_component(fluent_listitem, div, null);
    			append_dev(div, t6);
    			append_dev(div, p1);
    			append_dev(p1, t7);
    			append_dev(p1, t8);
    			append_dev(p1, t9);
    			append_dev(p1, br);
    			append_dev(p1, t10);
    			append_dev(p1, t11);
    			append_dev(div, t12);
    			append_dev(div, p2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(p2, null);
    				}
    			}

    			append_dev(div, t13);
    			mount_component(fluent_button, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fluent_checkbox_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fluent_checkbox_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_checked && dirty & /*listSel*/ 2) {
    				updating_checked = true;
    				fluent_checkbox_changes.checked = /*listSel*/ ctx[1];
    				add_flush_callback(() => updating_checked = false);
    			}

    			fluent_checkbox.$set(fluent_checkbox_changes);
    			const fluent_textbox_changes = {};

    			if (!updating_value && dirty & /*value*/ 4) {
    				updating_value = true;
    				fluent_textbox_changes.value = /*value*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			fluent_textbox.$set(fluent_textbox_changes);
    			const fluent_listitem_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fluent_listitem_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_selected && dirty & /*listSel*/ 2) {
    				updating_selected = true;
    				fluent_listitem_changes.selected = /*listSel*/ ctx[1];
    				add_flush_callback(() => updating_selected = false);
    			}

    			fluent_listitem.$set(fluent_listitem_changes);
    			if (!current || dirty & /*value*/ 4) set_data_dev(t8, /*value*/ ctx[2]);
    			if ((!current || dirty & /*listSel*/ 2) && t11_value !== (t11_value = (/*listSel*/ ctx[1] ? "checked" : "unchecked") + "")) set_data_dev(t11, t11_value);

    			if (dirty & /*exampleFileList*/ 8) {
    				each_value = /*exampleFileList*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(p2, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			const fluent_button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fluent_button_changes.$$scope = { dirty, ctx };
    			}

    			fluent_button.$set(fluent_button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fluent_checkbox.$$.fragment, local);
    			transition_in(fluent_textbox.$$.fragment, local);
    			transition_in(fluent_listitem.$$.fragment, local);
    			transition_in(fluent_button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fluent_checkbox.$$.fragment, local);
    			transition_out(fluent_textbox.$$.fragment, local);
    			transition_out(fluent_listitem.$$.fragment, local);
    			transition_out(fluent_button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(fluent_checkbox);
    			destroy_component(fluent_textbox);
    			destroy_component(fluent_listitem);
    			destroy_each(each_blocks, detaching);
    			destroy_component(fluent_button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_right_slot.name,
    		type: "slot",
    		source: "(65:2) ",
    		ctx
    	});

    	return block;
    }

    // (87:1) <Fluent.ContentDialog bind:open={displayWarningDialog} title="Warning">
    function create_default_slot_1(ctx) {
    	let t0;
    	let a0;
    	let t2;
    	let br0;
    	let t3;
    	let br1;
    	let t4;
    	let em;
    	let t5;
    	let a1;
    	let t7;

    	const block = {
    		c: function create() {
    			t0 = text("This software is under construction - things may be unimplemented, not work, or give unexpected output.\n\t\tDo not ask for support, open an issue report or a pull request (at ");
    			a0 = element("a");
    			a0.textContent = "this repo";
    			t2 = text(")\n\t\tif you are willing to fix the issue(s) yourself.");
    			br0 = element("br");
    			t3 = space();
    			br1 = element("br");
    			t4 = space();
    			em = element("em");
    			t5 = text("- Lifix (");
    			a1 = element("a");
    			a1.textContent = "@lifix";
    			t7 = text(" on Discord)");
    			attr_dev(a0, "href", "https://github.com/CheatBreakerX/LCE-Tool");
    			add_location(a0, file, 88, 69, 2837);
    			add_location(br0, file, 89, 50, 2954);
    			add_location(br1, file, 90, 2, 2962);
    			attr_dev(a1, "href", "https://discord.com/users/180430713873498113");
    			add_location(a1, file, 91, 15, 2983);
    			add_location(em, file, 91, 2, 2970);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a0, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, br0, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, br1, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, em, anchor);
    			append_dev(em, t5);
    			append_dev(em, a1);
    			append_dev(em, t7);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(br0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(br1);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(em);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(87:1) <Fluent.ContentDialog bind:open={displayWarningDialog} title=\\\"Warning\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:3) <Fluent.Button on:click={() => (displayWarningDialog = false)}>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Acknowledge");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(94:3) <Fluent.Button on:click={() => (displayWarningDialog = false)}>",
    		ctx
    	});

    	return block;
    }

    // (93:2) <svelte:fragment slot="footer">
    function create_footer_slot(ctx) {
    	let fluent_button;
    	let current;

    	fluent_button = new Button({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	fluent_button.$on("click", /*click_handler_2*/ ctx[9]);

    	const block = {
    		c: function create() {
    			create_component(fluent_button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(fluent_button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const fluent_button_changes = {};

    			if (dirty & /*$$scope*/ 32768) {
    				fluent_button_changes.$$scope = { dirty, ctx };
    			}

    			fluent_button.$set(fluent_button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fluent_button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fluent_button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fluent_button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_footer_slot.name,
    		type: "slot",
    		source: "(93:2) <svelte:fragment slot=\\\"footer\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let splitpane;
    	let t;
    	let fluent_contentdialog;
    	let updating_open;
    	let current;

    	splitpane = new SplitPane({
    			props: {
    				$$slots: {
    					right: [create_right_slot],
    					left: [create_left_slot]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function fluent_contentdialog_open_binding(value) {
    		/*fluent_contentdialog_open_binding*/ ctx[10](value);
    	}

    	let fluent_contentdialog_props = {
    		title: "Warning",
    		$$slots: {
    			footer: [create_footer_slot],
    			default: [create_default_slot_1]
    		},
    		$$scope: { ctx }
    	};

    	if (/*displayWarningDialog*/ ctx[0] !== void 0) {
    		fluent_contentdialog_props.open = /*displayWarningDialog*/ ctx[0];
    	}

    	fluent_contentdialog = new ContentDialog({
    			props: fluent_contentdialog_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(fluent_contentdialog, 'open', fluent_contentdialog_open_binding));

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(splitpane.$$.fragment);
    			t = space();
    			create_component(fluent_contentdialog.$$.fragment);
    			attr_dev(main, "class", "svelte-1t6hith");
    			add_location(main, file, 30, 0, 637);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(splitpane, main, null);
    			append_dev(main, t);
    			mount_component(fluent_contentdialog, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const splitpane_changes = {};

    			if (dirty & /*$$scope, displayWarningDialog, listSel, value*/ 32775) {
    				splitpane_changes.$$scope = { dirty, ctx };
    			}

    			splitpane.$set(splitpane_changes);
    			const fluent_contentdialog_changes = {};

    			if (dirty & /*$$scope, displayWarningDialog*/ 32769) {
    				fluent_contentdialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_open && dirty & /*displayWarningDialog*/ 1) {
    				updating_open = true;
    				fluent_contentdialog_changes.open = /*displayWarningDialog*/ ctx[0];
    				add_flush_callback(() => updating_open = false);
    			}

    			fluent_contentdialog.$set(fluent_contentdialog_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(splitpane.$$.fragment, local);
    			transition_in(fluent_contentdialog.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(splitpane.$$.fragment, local);
    			transition_out(fluent_contentdialog.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(splitpane);
    			destroy_component(fluent_contentdialog);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let displayWarningDialog = true;
    	let listSel = false;
    	let value = "Default value";

    	let exampleFileList = [
    		{
    			"name": "File #1",
    			"content": "Content #1"
    		},
    		{
    			"name": "File #2",
    			"content": "Content #2"
    		},
    		{
    			"name": "File #3",
    			"content": "Content #3"
    		},
    		{
    			"name": "File #4",
    			"content": "Content #4"
    		},
    		{
    			"name": "File #5",
    			"content": "Content #5"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function fluent_checkbox_checked_binding(value) {
    		listSel = value;
    		$$invalidate(1, listSel);
    	}

    	function fluent_textbox_value_binding(value$1) {
    		value = value$1;
    		$$invalidate(2, value);
    	}

    	function fluent_listitem_selected_binding(value) {
    		listSel = value;
    		$$invalidate(1, listSel);
    	}

    	const click_handler = () => $$invalidate(1, listSel = !listSel);
    	const click_handler_1 = () => $$invalidate(0, displayWarningDialog = true);
    	const click_handler_2 = () => $$invalidate(0, displayWarningDialog = false);

    	function fluent_contentdialog_open_binding(value) {
    		displayWarningDialog = value;
    		$$invalidate(0, displayWarningDialog);
    	}

    	$$self.$capture_state = () => ({
    		Fluent,
    		SplitPane,
    		displayWarningDialog,
    		listSel,
    		value,
    		exampleFileList
    	});

    	$$self.$inject_state = $$props => {
    		if ('displayWarningDialog' in $$props) $$invalidate(0, displayWarningDialog = $$props.displayWarningDialog);
    		if ('listSel' in $$props) $$invalidate(1, listSel = $$props.listSel);
    		if ('value' in $$props) $$invalidate(2, value = $$props.value);
    		if ('exampleFileList' in $$props) $$invalidate(3, exampleFileList = $$props.exampleFileList);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		displayWarningDialog,
    		listSel,
    		value,
    		exampleFileList,
    		fluent_checkbox_checked_binding,
    		fluent_textbox_value_binding,
    		fluent_listitem_selected_binding,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		fluent_contentdialog_open_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
