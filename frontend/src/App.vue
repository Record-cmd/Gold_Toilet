<script>
  export default {
    data: () => ({
      drawer: false,
      group: null,
      items: [
        {
          title: '홈',
          value: 'Home',
          to: '/',
        },
        {
          title: '관리자페이지지',
          value: 'AdminPanel',
          to: '/AdminPanel',
        },
        {
          title: '화장실 현황확인',
          value: 'ToiletCard',
          to: '/ToiletCard',
        },

      ],
    }),

    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>

<template>
<v-layout>
      <v-app-bar
        color="primary"
        prominent
      >
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <v-toolbar-title>화장실 관리 시스템</v-toolbar-title>

        <v-spacer></v-spacer>
      </v-app-bar>

      <v-navigation-drawer
        v-model="drawer"
        :location="$vuetify.display.mobile ? 'bottom' : undefined"
        temporary
      >
        <v-list>
          <v-list-item v-for="item in items" :key = "item.value" :href = "item.to">
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <RouterView />
      </v-main>
    </v-layout>

</template>
