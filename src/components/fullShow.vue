<template>
  <a-modal :visible="isfullshow" centered width="80%" class="full" :footer="null" @cancel="handleCancel">
    <div class="box">
        <div id="viewport_full" >
                
      </div>
    </div>
  </a-modal>
</template>

<script>

export default {
  name: "fullShow",
  props:['fulldata'],
  data() {
    return {
      isfullshow:true
    };
  },
  mounted() {
  //  console.log(888,this.fulldata);
   this.showScreenfull();
  },
  methods: {  
    handleCancel() {
      this.isfullshow = false;
      this.$emit("showFull",false);
    },
    showScreenfull(){

        var stage_full = new NGL.Stage("viewport_full", { backgroundColor: "white" });
        stage_full.loadFile(this.fulldata).then(function(o) {
          var selection = new NGL.Selection("UNL"); //UNL
          var radius = 5;
          var atomSet = o.structure.getAtomSetWithinSelection(
            selection,
            radius
          );
          var ligSet = o.structure.getAtomSetWithinSelection(selection, 0);
          var atomNeibor = o.structure.getAtomSetWithinSelection(selection, 8);
          atomNeibor = o.structure.getAtomSetWithinGroup(atomNeibor);
          atomSet = o.structure.getAtomSetWithinGroup(atomSet);
          let neighborRepr = o.addRepresentation("line", {
            sele: atomSet.toSeleString(),
            aspectRatio: 1.1,
            colorValue: "grey",
            multipleBond: "symmetric"
          });

          let ligandRepr = o.addRepresentation("ball+stick", {
            multipleBond: "symmetric",
            colorValue: "lime",
            sele: ligSet.toSeleString(),
            aspectRatio: 1.0,
            radiusScale: 1.2
          });
          let contactRepr = o.addRepresentation("contact", {
            sele: atomSet.toSeleString(),
            radiusSize: 0.09,
            weakHydrogenBond: true,
            waterHydrogenBond: true,
            backboneHydrogenBond: false
          });
          let labelRepr = o.addRepresentation("label", {
            sele: atomSet.toSeleString(),
            color: "#333333",
            yOffset: 0.2,
            zOffset: 2.0,
            attachment: "bottom-center",
            showBorder: true,
            borderColor: "lightgrey",
            borderWidth: 0.25,
            disablePicking: true,
            radiusType: "size",
            radiusSize: 1.2,
            labelType: "residue",
            labelGrouping: "residue"
          });
          let cartoonRepr = o.addRepresentation("cartoon", {
            sele: atomNeibor.toSeleString(),
            color: "white",
            visible: false
          });
          let duration = 1000;
          o.autoView(ligSet.toSeleString(), duration);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.box{
    width: 100%;
    height: 600px;
    // background-color: rgb(238, 229, 229);
    margin: 10px 6px;
    position: relative;
    #viewport_full{
        width: 100%;
        height: 100%;
        // display: block;
        z-index: 999;
    }
}
</style>

