<template>
    <div>
        <v-row class="box" align="center" v-if="!$store.state.user">
            <v-col>
                <h1 class="mb-12">Login</h1>
                <v-btn color="#fff" class="py-7" @click="login" block>
                    <v-icon class="mr-3">mdi-google</v-icon>Login with Google
                </v-btn>
            </v-col>
        </v-row>
        <v-row class="box" align="center" v-else>
            <v-col>
                <h1 class="mb-12">Welcome!</h1>
            </v-col>
        </v-row>
    </div>
</template>
<script>
    import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

    export default {
        data(){
            return {
                dialog: false,
                show: false,
            }
        },
        methods: {
            login() {
                this.dialog = false;
                const auth = getAuth();
                const provider = new GoogleAuthProvider();
                signInWithPopup(auth, provider)
                .then((result) => {
                    // This gives you a Google Access Token. You can use it to access the Google API.
                    const credential = GoogleAuthProvider.credentialFromResult(result);
                    const token = credential.accessToken;
                    // The signed-in user info.
                    this.$store.dispatch("authenticate");
                    this.pin = "";
                    // ...
                }).catch((error) => {
                    // Handle Errors here.
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    // The email of the user's account used.
                    const email = error.customData.email;
                    // The AuthCredential type that was used.
                    const credential = GoogleAuthProvider.credentialFromError(error);
                    // ...
                });
            }
        }
    };
</script>

<style lang="css" scoped>
    .box {
        height: calc(100vh - 64px);
        width: 70%;
        margin: 0 auto 0 auto;
    }
</style>