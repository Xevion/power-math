<template>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">Settings</p>
            <b-icon @click.native="$parent.close()" class="is-clickable" pack="fas" icon="times"></b-icon>
        </header>
        <section class="modal-card-body">
        </section>
    </div>
</template>

<style lang="scss">

</style>

<script>
export default {
    name: 'SettingsMenu',
    data() {
        return {
            levels: []
        }
    },
    created() {
    }
}
</script>
