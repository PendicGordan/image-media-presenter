<template>
    <div id="draggable-container" ref="draggableContainer">
        <div id="draggable-header" @mousedown="dragMouseDown">
            <slot name="header"></slot>
            <div v-if="!src" class="wrapper">
                <div  class="file-upload" >
                    <input type="file" accept="image/*" @change="onChange">
                    <em class="fa fa-arrow-up"></em>
                </div>
            </div>
            <v-img v-else
                   contain
                   :src="src"
                   :width="width"
            />
        <slot name="footer"></slot>
        </div>
    </div>
</template>

<script>
    export default {
        data: () => {
          return {
              src: null,
              width: "500",
              positions: {
                  clientX: undefined,
                  clientY: undefined,
                  movementX: 0,
                  movementY: 0
              }
          }
        },
        methods: {
            onChange(e) {
                if (! e.target.files.length) return;

                let file = e.target.files[0];

                let reader = new FileReader();

                reader.readAsDataURL(file);

                reader.onload = e => {
                    let src = e.target.result;
                    this.src = src;
                    this.$emit('loaded', { src, file });
                };
            },
            dragMouseDown: function (event) {
                event.preventDefault()
                // get the mouse cursor position at startup:
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY
                document.onmousemove = this.elementDrag
                document.onmouseup = this.closeDragElement
            },
            elementDrag: function (event) {
                event.preventDefault()
                this.positions.movementX = this.positions.clientX - event.clientX
                this.positions.movementY = this.positions.clientY - event.clientY
                this.positions.clientX = event.clientX
                this.positions.clientY = event.clientY
                // set the element's new position:
                this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
                this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
            },
            closeDragElement () {
                document.onmouseup = null
                document.onmousemove = null
            }
        },
        watch: {

        }
    }
</script>
<style scoped>
    #draggable-container {
        position: absolute;
        z-index: 9;
    }
    #draggable-header {
        z-index: 10;
    }
    .wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .wrapper .file-upload {
        height: 150px;
        width: 150px;
        border-radius: 100px;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 4px solid #2590EB;
        overflow: hidden;
        background-image: linear-gradient(to bottom, #2590EB 50%, #FFFFFF 50%);
        background-size: 100% 200%;
        transition: all 1s;
        color: #FFFFFF;
        font-size: 100px;
    }
    .wrapper .file-upload input[type='file'] {
        height: 125px;
        width: 125px;
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
        cursor: pointer;
    }
    .wrapper .file-upload:hover {
        background-position: 0 -100%;
        color: #2590EB;
    }
</style>
