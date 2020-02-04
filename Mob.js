//Developers NekoSamurai.
//https://github.com/NekoKot


var mob;
var mobState = "idle";

function useItem(x,y,z,itemId,blockId,side,itemDamage,blockDamage)
{
     if(itemId==280)
     {
          mob = Level.spawnMob(x, y + 1, z, 63, 'entity/alex.png');
          Entity.setHealth(mob, 100);
          Entity.setNameTag(mob, 'Моб');
     }
}

function modTick()
{
     if(mobState == "walkToPlayer")
     {
          WalkToTarget(mob, getPlayerEnt());
     }
}

function newLevel()
{
     OnHUD();
}

function leaveGame()
{
     OffHud();
     OffCommandMenu();
}
//---------------------------------------------Логика ИИ---------------------------------------------
//Примитивная логика движения одного моба к другому.
//Если упрётся в стену, то не сможет её обойти.
function WalkToTarget(entity, entityTarget)
{
     let direction = DirectionToEntity(entity, entityTarget);

     if(Math.round( DistanceToEntity(entity, entityTarget) ) >= 2)
     {
          setVelX(entity, 0.2 * Sign(direction.x));
          setVelZ(entity, 0.2 * Sign(direction.z));
          Entity.setRot(entity, direction.angle, 0);
          if(CheckBlocks(entity, direction))
          {
               setVelY(entity, 0.3);
          }
     }
}

//Примитивная логика движения моба к точке.
//Если упрётся в стену, то не сможет её обойти.
function WalkToPoint(entity, point)
{
     let direction = DirectionToPoint(entity, point);

     if(Math.round( DistanceToPoint(entity, point) ) != 0)
     {
          setVelX(entity, 0.2 * Sign(direction.x));
          setVelZ(entity, 0.2 * Sign(direction.z));
          Entity.setRot(entity, direction.angle, 0);
          if(CheckBlocks(entity, direction))
          {
               setVelY(entity, 0.3);
          }
     }
}

//---------------------------------------------Функции для Entity---------------------------------------------
function CheckBlocks(entity, direction)
{
     x = Math.round(Entity.getX(entity));
     y = Math.round(Entity.getY(entity));
     z = Math.round(Entity.getZ(entity));
     return getTile(x + direction.x, y, z + direction.z) != 0;
}

function DirectionToEntity(entity, entityTarget)
{

     x = Sign( Math.round(Entity.getX(entityTarget) - Entity.getX(entity)) );
     z = Sign( Math.round(Entity.getZ(entityTarget) - Entity.getZ(entity)) );

      
     if(x < 0 && z > 0) angle = 45;
     else if(x < 0 && z == 0) angle = 90;
     else if(x < 0 && z < 0) angle = 135;
     else if(x == 0 && z < 0) angle = 180;
     else if(x > 0 && z < 0) angle = 225;
     else if(x > 0 && z == 0) angle = 270;
     else if(x > 0 && z > 0) angle = 315;
     else angle = 0;

     return new Direction(x, z, angle);
}

function DirectionToPoint(entity, point)
{

     x = Sign( Math.round(point.x - Entity.getX(entity)) );
     z = Sign( Math.round(point.z - Entity.getZ(entity)) );

      
     if(x < 0 && z > 0) angle = 45;
     else if(x < 0 && z == 0) angle = 90;
     else if(x < 0 && z < 0) angle = 135;
     else if(x == 0 && z < 0) angle = 180;
     else if(x > 0 && z < 0) angle = 225;
     else if(x > 0 && z == 0) angle = 270;
     else if(x > 0 && z > 0) angle = 315;
     else angle = 0;

     return new Direction(x, z, angle);
}

function DistanceToEntity(entity, entity2)
{
     x1 = Entity.getX(entity);
     z1 = Entity.getZ(entity);

     x2 = Entity.getX(entity2);
     z2 = Entity.getZ(entity2);

     return Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((z2 - z1), 2) );
}

function DistanceToPoint(entity, point)
{
     x1 = Entity.getX(entity);
     z1 = Entity.getZ(entity);

     x2 = point.x;
     z2 = point.z;

     return Math.sqrt( Math.pow((x2 - x1), 2) + Math.pow((z2 - z1), 2) );
}

//---------------------------------------------Математика---------------------------------------------
function Vector2(x,z)
{
     this.x = 0;
     this.z = 0;

     this.constructor = function()
     {
          this.x = x;
          this.z = z;
     }
     this.constructor();
}

function Direction(x, z, angle)
{
     this.x = 0;
     this.z = 0;
     this.angle = 0;

     this.constructor = function()
     {
          this.x = x;
          this.z = z;
          this.angle = angle;
     }
     this.constructor();
}

function Sign(value)
{
     if(value > 0) return 1;
     else if(value < 0) return -1;
     else return 0;
}

//---------------------------------------------GUI---------------------------------------------
var hudGUI;
var commandGUI;

//Главный экран
function OnHUD()
{
     var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
     ctx.runOnUiThread(new java.lang.Runnable({ run: function(){
     try{ 
          var hudLayout = new android.widget.LinearLayout(ctx);
          hudLayout.setOrientation(1);

          var onCommandButton = new android.widget.Button(ctx);
          onCommandButton.setText('Команды');
          onCommandButton.setOnClickListener(new android.view.View.OnClickListener({
               onClick: function(viewarg)
               {
                    OnCommandMenu();
                    OffHud();
               }
          }));
          hudLayout.addView(onCommandButton);

          hudGUI = new android.widget.PopupWindow(hudLayout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
          hudGUI.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
          hudGUI.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
          }
          catch(err)
          {
               print('An error occured: ' + err);
          } 
     }}));
}

function OffHud()
{
     var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
     ctx.runOnUiThread(new java.lang.Runnable({ run: function(){
          if(hudGUI != null)
          {
               hudGUI.dismiss();
               hudGUI = null;
          }
     }}));
}

//Меню команд
function OnCommandMenu()
{
     var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
     ctx.runOnUiThread(new java.lang.Runnable({ run: function(){
     try{ 
          var commandLayout = new android.widget.LinearLayout(ctx);
          commandLayout.setOrientation(1);

          if(mobState == "walkToPlayer")
          {
               var followMyButton = new android.widget.Button(ctx);
               followMyButton.setText('Стой.');
               followMyButton.setOnClickListener(new android.view.View.OnClickListener({
                    onClick: function(viewarg)
                    {
                         mobState = "idle";
                         OffCommandMenu()
                         OnHUD();
                    }
               }));
               commandLayout.addView(followMyButton);
          }
          else
          {
               var followMyButton = new android.widget.Button(ctx);
               followMyButton.setText('Следуй за мной.');
               followMyButton.setOnClickListener(new android.view.View.OnClickListener({
                    onClick: function(viewarg)
                    {
                         mobState = "walkToPlayer";
                         OffCommandMenu();
                         OnHUD();
                    }
               }));
               commandLayout.addView(followMyButton);
          }

          var exitButton = new android.widget.Button(ctx);
          exitButton.setText('Закрыть.');
          exitButton.setOnClickListener(new android.view.View.OnClickListener({
               onClick: function(viewarg)
               {
                    OffCommandMenu();
                    OnHUD();
               }
          }));
          commandLayout.addView(exitButton);

          commandGUI = new android.widget.PopupWindow(commandLayout, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT, android.widget.RelativeLayout.LayoutParams.WRAP_CONTENT);
          commandGUI.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.TRANSPARENT));
          commandGUI.showAtLocation(ctx.getWindow().getDecorView(), android.view.Gravity.CENTER | android.view.Gravity.CENTER, 0, 0);
          }
          catch(err)
          {
               print('An error occured: ' + err);
          } 
     }}));
}

function OffCommandMenu()
{
     var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();
     ctx.runOnUiThread(new java.lang.Runnable({ run: function(){
          if(commandGUI != null)
          {
               commandGUI.dismiss();
               commandGUI = null;
          }
     }}));
}